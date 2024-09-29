import React from 'react';
import TOC from '@theme-original/TOC';

export default function TOCWrapper(props) {
  return (
    <>
      <TOC {...props} />
      <hr></hr>
      <br/>
      <a aria-label="Deploys by ">
                  <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by " width="114" height="51" />
                </a>
    </>
    
  );
}
