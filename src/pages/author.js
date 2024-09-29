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
              src="https://media.licdn.com/dms/image/v2/D5603AQEFjmDrPmgjMw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1670779204183?e=1733356800&v=beta&t=vdfdVvIJLQ5ELWifvPFrb9MtrHhZAUiGGXDxJQ9OSfM"
              alt="Author Photo"
              style={{
                borderRadius: '50%',
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
           <h1>About Me</h1>
    <p>
        I’m <strong>Shafi Ur Rahman</strong>, a cybersecurity professional with over 13 years of experience in offensive security. 
        Throughout my career, I’ve had the privilege of leading cutting-edge security operations, including red teaming, penetration testing, 
        and vulnerability assessments for organizations across various sectors. I’m certified in OSCP, CRTP, and CISM, and my passion lies 
        in helping businesses strengthen their defenses against modern cyber threats.
    </p>

    <h2>What I Do:</h2>
    <ul>
        <li>Lead offensive security engagements, including VAPT, Red Teaming, and BAS</li>
        <li>Penetration testing using frameworks like MITRE ATT&CK and methodologies like OWASP and OSSTMM</li>
        <li>Master various security tools such as Kali Linux, Nessus, Nmap, Burp Suite, and more</li>
        <li>Test API, Mobile, and Web Applications using SAST, DAST techniques, and OWASP guidelines</li>
        <li>Enhance security posture using a full-stack understanding of applications with coding experience in C, C++, C#, JavaScript, Python, and PHP</li>
        <li>Ensure compliance with PCI-DSS, ISO 27001, and risk assessments via CVSS</li>
        <li>Constantly improve security testing and reporting with AI tools like ChatGPT</li>
    </ul>

    <h2>Achievements:</h2>
    <ul>
        <li>Discovered CVE-2021-40683 (Privilege Escalation vulnerability in Akamai EAA Client)</li>
        <li>Trained and mentored teams to enhance offensive security skills and operational performance</li>
        <li>Developed and implemented VAPT strategies that helped increase security service offerings</li>
        <li>Regularly share insights and knowledge through webinars on offensive security techniques</li>
    </ul>

    <p>
        If you’d like to dive deeper into my work, connect with me on&nbsp; 
        <a href="https://www.linkedin.com/in/shkshafi" target="_blank">LinkedIn</a>, follow my projects on&nbsp; 
        <a href="https://github.com/shkshafi" target="_blank">GitHub</a>, or explore my thoughts and ideas on my&nbsp; 
        <a href="blog/">blog</a>.
    </p>
          </div>
        </div>
      </div>
  </Layout>
  );
}