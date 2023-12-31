import { useState } from 'react';
import { getFileFromBase64, getTxtFile } from '../helpers/files';

const URL_API = import.meta.env.VITE_URL_API;

export const useBall = () => {
  const [files, setFiles] = useState({});
  const [cropped, setCropped] = useState({});
  const [fullName, setFullName] = useState();
  const [number, setNumber] = useState();
  const [isRotateConstructor, setIsRotateConstructor] = useState(false);

  function rotateConstructor() {
    setIsRotateConstructor((prev) => !prev);
  }

  function changeFile(id, file) {
    setFiles((prev) => {
      const res = { ...prev };
      res[id] = { id, file };
      return res;
    });
  }

  function changeCropped(id, cropped) {
    setCropped((prev) => {
      const res = { ...prev };
      res[id] = { id, cropped };
      return res;
    });
  }

  async function getCroppedFiles() {
    let croppedValues = Object.values(cropped);
    const croppedPromises = croppedValues.map(async (croppedValue) => {
      const file = await getFileFromBase64(croppedValue.cropped);
      return { id: croppedValue.id, cropped: file };
    });
    croppedValues = await Promise.all(croppedPromises);
    return croppedValues;
  }

  async function sendFiles(propfiles, userInfo) {
    const filesValues = Object.values(files);
    const croppedValues = await getCroppedFiles();

    const formData = new FormData();

    filesValues.forEach((file) => {
      formData.append(file.id.toString(), file.file);
    });

    croppedValues.forEach((cropped) => {
      formData.append(cropped.id.toString(), cropped.cropped);
    });

    if (propfiles) {
      propfiles.forEach((file) => {
        formData.append(file.name, file.file);
      });
    }

    formData.append('full_name', userInfo.FIO);
    formData.append('email', userInfo.email);
    formData.append('phone', userInfo.phone);
    formData.append('address', userInfo.address);

    if (number || fullName) {
      const nameAndNumber = `Имя игрока (надпись на мяче): ${fullName}\nНомер игрока: ${number}`;
      const nameAndNumberFile = getTxtFile(nameAndNumber, 'nameAndNumber.txt');

      formData.append('2_3_5', nameAndNumberFile);
    }

    return fetch(URL_API + '/upload', {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());
  }

  async function fetchPay(orderId) {
    const options = {
      cloud_dir_name: orderId,
      amount: '5000.00',
      payment_method_type: 'bank_card',
      confirmation: {
        type: 'redirect',
        return_url: 'https://i.moymyach.ru/success',
      },
    };

    return fetch(URL_API + '/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    }).then((res) => res.json());
  }
  return {
    files,
    changeFile,
    sendFiles,
    changeCropped,
    fullName,
    setFullName,
    number,
    setNumber,
    fetchPay,
    isRotateConstructor,
    rotateConstructor,
  };
};
