// app/emailTemplate.tsx
interface EmailTemplateProps {
  description: string;
  lastName: string;
  token: string;
  host: string;
  path: string;
  buttonValue: string;
}

const EmailTemplate = ({
  description,
  lastName,
  token,
  host,
  path,
  buttonValue,
}: EmailTemplateProps) => {
  const fullUrl = `http://${host}${path}${token}`;

  return (
    <html>
      <body>
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            padding: "20px",
            // textAlign: "center",
          }}
        >
          <h1 style={{ color: "#333" }}>Hello, {lastName}</h1>
          <p>Please click the following button {description}.</p>
          <a
            href={fullUrl}
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "5px",
              marginTop: "10px",
            }}
          >
            {buttonValue}
          </a>
        </div>
      </body>
    </html>
  );
};

export default EmailTemplate;
