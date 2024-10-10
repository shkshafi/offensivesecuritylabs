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
                <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>
                <amp-ad width="100vw" height="320"
     type="adsense"
     data-ad-client="ca-pub-1260667564079492"
     data-ad-slot="1240870063"
     data-auto-format="rspv"
     data-full-width="">
  <div overflow=""></div>
</amp-ad>
    </>
    
  );
}
