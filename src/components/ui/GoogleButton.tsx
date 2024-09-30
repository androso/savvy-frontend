// GoogleLoginButton.tsx
import styled from "styled-components";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

const StyledWrapper = styled.div`
  .styled-button {
    position: relative;
    padding: 0.5rem 1rem; /* Reduced padding */
    font-size: 0.9rem; /* Reduced font size */
    font-weight: bold;
    color: #ffffff;
    background: linear-gradient(to bottom, #171717, #242424);
    border-radius: 9999px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 1), 0 10px 20px rgba(0, 0, 0, 0.4);
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #292929;
  }

  .styled-button::before {
    content: "";
    position: absolute;
    top: -2px;
    right: -1px;
    bottom: -1px;
    left: -1px;
    background: linear-gradient(to bottom, #292929, #000000);
    z-index: -1;
    border-radius: 9999px;
    transition: all 0.2s ease;
    opacity: 1;
  }

  .styled-button:active {
    transform: translateY(2px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 1), 0 5px 10px rgba(0, 0, 0, 0.4);
  }

  .inner-button {
    position: relative; /* Ensure relative positioning for pseudo-element */
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom, #171717, #242424);
    width: 30px; /* Adjusted size */
    height: 30px; /* Adjusted size */
    margin-left: 8px; /* Adjusted margin */
    border-radius: 50%;
    box-shadow: 0 0 1px rgba(0, 0, 0, 1);
    border: 1px solid #252525;
    transition: all 0.2s ease;
  }

  .inner-button::before {
    content: "";
    position: absolute;
    top: -2px;
    right: -1px;
    bottom: -1px;
    left: -1px;
    background: linear-gradient(to bottom, #292929, #000000);
    z-index: -1;
    border-radius: 9999px;
    transition: all 0.2s ease;
    opacity: 1;
  }

  .icon {
    filter: drop-shadow(0 10px 20px rgba(26, 25, 25, 0.9))
      drop-shadow(0 0 4px rgba(0, 0, 0, 1));
    transition: all 0.4s ease-in-out;
  }

  .icon:hover {
    filter: drop-shadow(0 10px 20px rgba(50, 50, 50, 1))
      drop-shadow(0 0 20px rgba(2, 2, 2, 1));
    transform: rotate(-35deg);
  }
`;

const GoogleLoginButton: React.FC<{ onSuccess: (response: CredentialResponse) => void, onError: () => void }> = ({ onSuccess, onError }) => {
  const handleLoginSuccess = (response: CredentialResponse) => {
    if (response.credential) {
      onSuccess(response);
    }
  };

  const handleLoginFailure = () => {
    onError();
  };

  return (
    <StyledWrapper>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
        prompt="select_account" // optional: customize Google Login prompt
      >
        <div className="styled-button" onClick={(e) => e.preventDefault()}>
          <span>Login with Google</span>
          <div className="inner-button">
            <svg
              id="GoogleIcon"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              height="30px"
              width="30px"
              className="icon"
            >
              <path d="M16 3c1.547 0 2.915.3 4.154.844l-.884 1.533A13.354 13.354 0 0 0 16 4c-6.706 0-12.083 5.377-12.083 12.083 0 6.706 5.377 12.083 12.083 12.083 6.147 0 11.136-4.727 11.136-11.136 0-.516-.037-1.021-.115-1.507h-10.23V14h5.65c-.366 2.154-2.426 4-5.653 4-3.254 0-5.909-2.644-5.909-5.912 0-3.267 2.658-5.912 5.909-5.912z" />
            </svg>
          </div>
        </div>
      </GoogleLogin>
    </StyledWrapper>
  );
};

export default GoogleLoginButton;
