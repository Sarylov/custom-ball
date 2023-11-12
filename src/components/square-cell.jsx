/* eslint-disable react/prop-types */
import { useState } from 'react';
import { CropperImage } from './cropper-image';
import { Modal } from './modal';

export const SquareCell = ({
  id,
  width,
  height,
  className,
  classNameWrapper,
}) => {
  const [imageSrc, setImageSrc] = useState('');
  const [croppedImage, setCroppedimage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={classNameWrapper}>
      <Modal
        name={`crop-${id}`}
        title={`Загрузить картинку ${id}`}
        content={
          <div className="flex flex-col gap-4 mt-4">
            <input
              className="file-input w-full "
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="w-full h-[60vh]">
              <CropperImage
                setCroppedimage={setCroppedimage}
                imageSrc={imageSrc}
              />
            </div>
          </div>
        }
      >
        <div
          className={`${className} cursor-pointer cell bg-gray-700 flex justify-center items-center`}
          style={{ width, height }}
        >
          {croppedImage ? (
            <img
              src={croppedImage}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <p className="text-white">{id}</p>
          )}
        </div>
      </Modal>
    </div>
  );
};
