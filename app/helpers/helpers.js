import "dotenv/config";

export function getImage(image){
  return image? `${process.env.APP_URL}/storage/${image}`:`${process.env.APP_URL}/storage/non.png`;
}

export function asset_path(data){
  return data? `${process.env.APP_URL}/${data}`:`${process.env.APP_URL}/`;
}

export function storage_path(data){
  return data? `${process.env.APP_URL}/storage/${data}`:`${process.env.APP_URL}/storage/`;
}

export function url(data){
  return data? `${process.env.APP_URL}/${data}`:`${process.env.APP_URL}/`;
}
