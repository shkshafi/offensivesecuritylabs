import React from 'react';
import Layout from '@theme/Layout';

export default function Test() {
  return (
    <Layout title="Test Page" description="A simple page to test deployment and routing.">
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center' }}>
        <h1>Deployment Test Page</h1>
        <p>This is a test page to verify successful git deployment to Hostinger.</p>
      </div>
    </Layout>
  );
}
