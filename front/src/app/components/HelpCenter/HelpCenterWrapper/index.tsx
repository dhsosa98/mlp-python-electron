import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import HelpCenterTitle from '../HelpCenterTitle';

const Wrapper = styled.div`
  /* add styles for the text */
  animation: reveal 0.5s ease-in-out forwards;

  @keyframes reveal {
    from {
      visibility: hidden;
      transform: translateY(100%);
    }
    to {
      visibility: visible;
      transform: translateY(0);
    }
  }
`;




const HelpCenterWrapper: FC = (props: any) => {

    const { t: T } = useTranslation();

    const [isShow, setIsShow] = useState(false);

    const handleClose = () => {
        setIsShow(false);
    }

    const handleOpen = () => {
        setIsShow(true);
    }

    useEffect(() => {
        if (isShow) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
    }, [isShow]);

    if (isShow) {
        return (
            <Wrapper className="fixed bottom-0 right-0 sm:m-4 sm:max-w-sm w-full sm:h-auto h-full shadow-md z-[100]">
                <HelpCenterTitle onClick={handleClose} >
                    <h2 className='flex flex-grow text-left w-full'>{T("Help Center")}</h2>
                    <span><svg className='fill-white' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg></span>
                </HelpCenterTitle>
                <div className="dark:bg-gray-900 bg-white shadow-md p-4 relative rounded-b-lg">
                    <div className="text-gray-800 text-base sm:max-h-[75vh] h-[calc(100vh-70px)] overflow-auto">{props.children}</div>
                </div>
            </Wrapper>
        );
    }

    return (
        <div className="fixed bottom-10 right-5 m-4 max-w-sm">
            <button onClick={handleOpen} className="dark:bg-blue-700 dark:hover:bg-blue-900 bg-sky-500 hover:bg-sky-500  text-white font-bold py-2 px-4 rounded-full absolute -top-2 -right-2 whitespace-nowrap">
                {T("Help?")}
            </button>
        </div>
    );
};

export default HelpCenterWrapper;