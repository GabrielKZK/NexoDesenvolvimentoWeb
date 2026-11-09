import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

export type OrigemFoto = 'camera' | 'galeria';

/** Lado maior da foto enviada. O servidor aceita até 2 MB (JPEG/PNG/WebP); 512 px em JPEG fica bem abaixo disso. */
const LADO_MAXIMO = 512;

export class PermissaoNegadaError extends Error {
  constructor(origem: OrigemFoto) {
    super(
      origem === 'camera'
        ? 'Sem permissão para usar a câmera. Libere o acesso nas configurações do aparelho.'
        : 'Sem permissão para acessar as fotos. Libere o acesso nas configurações do aparelho.',
    );
  }
}

/**
 * Abre a câmera ou a galeria, deixa recortar em quadrado e devolve um JPEG reduzido
 * (URI local) pronto para POST /api/usuarios/me/foto. Devolve null se o usuário cancelar.
 *
 * O servidor só aceita JPEG, PNG e WebP (detecta pelo conteúdo): reencodar em JPEG aqui
 * evita rejeição de HEIC/HEIF, que o iOS entrega por padrão desde o SDK 54.
 */
export async function escolherFotoPerfil(origem: OrigemFoto): Promise<string | null> {
  if (origem === 'camera') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) throw new PermissaoNegadaError(origem);
  }

  const opcoes: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.9,
  };
  const resultado =
    origem === 'camera' ? await ImagePicker.launchCameraAsync(opcoes) : await ImagePicker.launchImageLibraryAsync(opcoes);

  if (resultado.canceled || !resultado.assets?.[0]) return null;
  const asset = resultado.assets[0];

  const contexto = ImageManipulator.manipulate(asset.uri);
  // Só reduz se passar do limite; o lado maior define a dimensão a fixar.
  if (Math.max(asset.width, asset.height) > LADO_MAXIMO) {
    contexto.resize(asset.width >= asset.height ? { width: LADO_MAXIMO } : { height: LADO_MAXIMO });
  }
  const imagem = await contexto.renderAsync();
  const salva = await imagem.saveAsync({ format: SaveFormat.JPEG, compress: 0.8 });
  return salva.uri;
}
