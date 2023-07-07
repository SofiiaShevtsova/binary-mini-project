import PropTypes from 'prop-types';
import Cropper from 'react-easy-crop';

import { Button } from '~/libs/components/button/button.jsx';
import { ButtonColor, ButtonType } from '~/libs/enums/enums.js';
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
    <>
      <Cropper
        image={imageUrl}
        zoom={zoom}
        crop={crop}
        style={{
          containerStyle: { backgroundColor: 'rgba(12, 163, 163, 0.8)' },
          cropAreaStyle: { border: '2px solid red' }
        }}
        cropSize={{ width: 200, height: 200 }}
        onCropChange={handleOnCropChange}
        onZoomChange={handleOnZoomChange}
        onCropComplete={handleOnCropComplete}
      />
      <div className={styles.buttonArea}>
        <Button
          onClick={onCancel}
          color={ButtonColor.TEAL}
          type={ButtonType.BUTTON}
        >
          Cancel
        </Button>
        <Button
          onClick={handleOnCrop}
          color={ButtonColor.BLUE}
          type={ButtonType.BUTTON}
        >
          Crop
        </Button>
      </div>
    </>
  );
};

ImageCrop.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  setCroppedImageFor: PropTypes.func.isRequired
};

export { ImageCrop };
