import React from 'react';
import Layout from '@theme/Layout';
import '../style.css'

export default function Hello() {
  return (
    <Layout title="About the Author" description="Learn more about the author">
    <div
        className="container"
        style={{
          maxWidth: '800px',
          margin: '40px auto',
          padding: '20px',
        }}
      >
        <div
          className="row"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <div
            className="col"
            style={{
              flexBasis: '33.33%',
            }}
          >
            <img
              src="https://media.istockphoto.com/id/1745502643/photo/hand-of-an-asian-woman-operating-a-computer-at-a-cafe.jpg?s=612x612&w=0&k=20&c=GKcutC05vuC7d8_kRFj9M_gARB9A8XDqBv5ZVC5TpAE="
              alt="Author Photo"
              style={{
                // borderRadius: '50%',
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                margin: '20px',
              }}
            />
          </div>
          <div
            className="col"
            style={{
              flexBasis: '66.67%',
            }}
          >
           <h1>Contact</h1>
        <p>
            Thank you for visiting! If you have any inquiries or would like to reach out to me, feel free to contact me via email.
            Whether it's about requesting content credit conflicts/takedowns, suggesting topics to be covered, seeking 1:1 consultation, new project requests, pre-sales query
            or any other general queries, I’m happy to connect with you.
        </p>

        
            <p>
                Email: <a href="mailto:support@offensivesecuritylabs.com">support@offensivesecuritylabs.com</a>
            </p>
            <p>
                I look forward to hearing from you and engaging with your requests.
            </p>
        
          </div>
        </div>
      </div>
  </Layout>
  );
}