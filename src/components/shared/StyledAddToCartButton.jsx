import React from 'react';
import styled from 'styled-components';

const StyledAddToCartButton = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button className="button" onClick={onClick}>
        Add to Cart
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    cursor: pointer;
    position: relative;
    padding: 8px 20px;
    font-size: 14px;
    color: white;
    border: 2px solid white;
    border-radius: 30px;
    background-color: transparent;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    overflow: hidden;
  }

  .button::before {
    content: '';
    position: absolute;
    inset: 0;
    margin: auto;
    width: 50px;
    height: 50px;
    border-radius: inherit;
    scale: 0;
    z-index: -1;
    background-color: white;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .button:hover::before {
    scale: 3;
  }

  .button:hover {
    color: oklch(0.45 0.085 224.283);
    scale: 1.05;
  
  }

  .button:active {
    scale: 1;
  }
`;

export default StyledAddToCartButton;
