import { useEffect, useState } from "react";

export default function Error({ msg }: any) {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState(msg);

  useEffect(() => {
    if (message !== msg) {
      setMessage(msg);
      setIsVisible(true);
    }

    if (isVisible) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, msg, message]);

  const handleClick = () => {
    setIsVisible(false);
  };

  return (
    <div  
      className={`max-w-[90%] md:max-w-[30%] w-fit fixed top-24 right-2 bg-red-400 text-white mt-5 px-4 py-2 rounded-lg transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClick}
    >
      {message.split('%')[0]}
    </div>
  )
}