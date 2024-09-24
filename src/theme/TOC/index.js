import React from 'react';
import TOC from '@theme-original/TOC';

export default function TOCWrapper(props) {
  return (
    <>
      <TOC {...props} />
      <hr></hr>
      <br/>
                <a href="https://www.netlify.com" target="_blank" rel="noreferrer noopener" aria-label="Deploys by Netlify">
                  <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" width="114" height="51" />
                </a>
    </>
  );
}
