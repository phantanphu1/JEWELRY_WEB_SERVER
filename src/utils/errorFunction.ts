export const errorFunction = (
    errorBit: boolean,
    statuscode: number,
    msg: string,
    data?: any,
    where?: string
  ) => {
    if (errorBit) return { statuscode: statuscode, message: msg };
    else
      return {
        statuscode: statuscode,
        message: msg,
        data: data,
        id: where,
      };
  };
  