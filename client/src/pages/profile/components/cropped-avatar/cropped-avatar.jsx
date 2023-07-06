import PropTypes from 'prop-types';
import Cropper from 'react-easy-crop';

import { useCallback, useState } from '~/libs/hooks/hooks.js';
import { image as imageService } from '~/packages/image/image.js';

import { getCroppedImg } from './libs/cropped-image.js';
import styles from './styles.module.scss';

const handleUploadImage = file => imageService.uploadImage(file);

const ImageCrop = ({ imageUrl, onCancel, setCroppedImageFor }) => {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleOnCropChange = useCallback(crop => {
    setCrop(crop);
  }, []);

  const handleOnZoomChange = useCallback(zoom => {
    setZoom(zoom);
  }, []);

  const handleOnCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleOnCrop = useCallback(async () => {
    const croppedImageFile = await getCroppedImg(imageUrl, croppedAreaPixels);
    const image = await handleUploadImage(croppedImageFile);
    setCroppedImageFor(image);
  }, [croppedAreaPixels, imageUrl, setCroppedImageFor]);

  return (
    <div>
      {/* <div className={styles.backdrop}></div> */}
      <div className={styles.cropContainer}>
        <Cropper
          image={imageUrl}
          zoom={zoom}
          crop={crop}
          // aspect={3 / 3}
          cropSize={{ width: 200, height: 200 }}
          onCropChange={handleOnCropChange}
          onZoomChange={handleOnZoomChange}
          onCropComplete={handleOnCropComplete}
        />
      </div>
      <div className={styles.controls}>
        <div className={styles.buttonArea}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={handleOnCrop}>Crop</button>
        </div>
      </div>
    </div>
  );
};

ImageCrop.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  setCroppedImageFor: PropTypes.func.isRequired
};

export { ImageCrop };
