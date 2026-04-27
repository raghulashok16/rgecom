// ErrorPage — displays a full-page error with a status code, title, message, and retry button.
//
// Props:
//   status   - HTTP status code (e.g. 400, 401, 404, 500)
//   message  - optional custom message from the server to override the default
//   onRetry  - optional function called when "Try Again" is clicked
//              if not provided, falls back to window.location.reload()

const errorInfo = {
  400: { code: '400', title: 'Bad Request',    message: 'The request was invalid. Please check your input and try again.' },
  401: { code: '401', title: 'Unauthorized',   message: 'You need to be logged in to access this.' },
  404: { code: '404', title: 'Not Found',      message: 'The resource you are looking for could not be found.' },
  500: { code: '500', title: 'Server Error',   message: 'Something went wrong on our end. Please try again later.' },
};

const ErrorPage = ({ status, message, onRetry }) => {
  const info = errorInfo[status] || { code: status ?? '!', title: 'Error', message };
  const handleRetry = onRetry ?? (() => window.location.reload());

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-8xl font-bold text-gray-200">{info.code}</p>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">{info.title}</h2>
      <p className="text-gray-500 mt-2 max-w-md">{message || info.message}</p>
      <button
        onClick={handleRetry}
        className="mt-6 px-6 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorPage;
