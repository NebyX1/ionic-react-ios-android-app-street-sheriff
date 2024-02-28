import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const handleImageChange = async (setImagePreview, setImage) => {
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });
    const response = await fetch(photo.webPath);
    const blob = await response.blob();

    // Si photo.fileName es undefined, generamos uno nosotros mismos.
    const fileName = photo.fileName || `image-${Date.now()}.jpeg`;

    let reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImage({ fileName, blob });
    };
    reader.readAsDataURL(blob);
  } catch (error) {
    console.error("Error al seleccionar la imagen", error);
  }
};