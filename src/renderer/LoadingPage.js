import React from 'react';
import loading from './styles/loading.json'
import Lottie from 'react-lottie'

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
}

const LoadingPage = props => {
    return (
        <div className="main">
            <Lottie options={defaultOptions} height={120} width={120} speed={4}/>
            <div className="text">{props.text}</div>
            <style>{`
                .donut {
                    display: inline-block;
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-left-color: #7983ff;
                    border-radius: 50%;
                    animation: donut-spin 1.2s linear infinite;
                    margin-top: 10px;
                }

                .main {
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    font-size: 20px;
                    background-color: #16161a;
                }

                .main .loader {
                    width: 100px;
                    height: 100px;
                    margin-bottom: 10px;
                }

                .main .text {
                    color: white;
                }

            `}</style>
        </div>
    )
}

export default LoadingPage;