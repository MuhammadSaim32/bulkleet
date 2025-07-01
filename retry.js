async function retry_request(function_to_execute, ...args) {
  let count_request_numbers = 0;
  console.log(function_to_execute, ...args);
  while (true) {
    try {
      const response = await function_to_execute(...args);
      return response;
      break;
    } catch (error) {
      count_request_numbers++;

      if (count_request_numbers >= 3) {
        break;
      }
    }
  }
}

export { retry_request };
