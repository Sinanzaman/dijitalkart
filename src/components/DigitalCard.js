import React, { useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import "../CSS/DigitalCard.css";

const DigitalCard = ({
  cardid,
  designindex,
  profileImage,
  profileFile,
  backgroundImage,
  backgroundFile,
  fullName,
  jobTitle,
  about,
  email,
  phone,
  linkedin,
  github,
  website,
  skills,
  projects,
}) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 150;

  const toggleExpanded = () => setExpanded(!expanded);

  const isLong = about && about.length > maxLength;
  const displayedText = !isLong
    ? about
    : expanded
    ? about
    : about.substring(0, maxLength) + "...";

  const copyCardId = () => {
    if (!cardid) return;
    navigator.clipboard.writeText(cardid);
    alert("Card ID kopyalandı: " + cardid);
  };

  return (
    <div
      className={`preview${designindex}`}
      style={{
        backgroundImage: backgroundFile
          ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${URL.createObjectURL(
              backgroundFile
            )})`
          : backgroundImage
          ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`
          : "none",
        backgroundColor:
          backgroundImage || backgroundFile
            ? "transparent"
            : "rgba(0, 0, 0, 0.5)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className={`image-wrapper${designindex}`}>
        {profileFile ? (
          <img src={URL.createObjectURL(profileFile)} alt="Profil" />
        ) : profileImage ? (
          <img src={profileImage} alt="Profil" />
        ) : (
          <img src={require('../images/avatar.jpg')} />
        )}
      </div>

      <h2>{fullName || "Ad Soyad"}</h2>
      <h4>{jobTitle || "İş Pozisyonu"}</h4>
      <p>
        {about ? (
          <>
            <strong>Hakkında:</strong> {displayedText}{" "}
            {isLong && (
              <span
                onClick={toggleExpanded}
                style={{ color: "blue", cursor: "pointer", userSelect: "none" }}
              >
                {expanded ? "Daha az" : "Daha fazla"}
              </span>
            )}
          </>
        ) : (
          "Hakkında kısmı burada görünecek."
        )}
      </p>

      <p>
        <b>Email:</b>{" "}
        {email ? (
          <a href={`mailto:${email}`} style={{ fontWeight: "bold" }}>
            {email}
          </a>
        ) : (
          "-"
        )}
      </p>
      <p>
        <b>Telefon:</b>{" "}
        {phone ? (
          <a href={`tel:${phone}`} style={{ fontWeight: "bold" }}>
            {phone}
          </a>
        ) : (
          "-"
        )}
      </p>
      <p>
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
        {github && (
          <a href={github} target="_blank" rel="noreferrer">
            {" "}
            Github{" "}
          </a>
        )}
        {website && (
          <a href={website} target="_blank" rel="noreferrer">
            {" "}
            Websitesi{" "}
          </a>
        )}
      </p>

      <div>
        <b>Yetenekler:</b>
        <ul>
          {skills.length > 0 ? (
            skills.map((skill) => <li key={skill}>{skill}</li>)
          ) : (
            <li>Henüz eklenmedi</li>
          )}
        </ul>
      </div>

      <div>
        <b>Projeler:</b>
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div key={index} className={`project-item${designindex}`}>
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  style={{ maxWidth: "150px", maxHeight: "100px" }}
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
              <p>
                <a href={project.projectUrl} target="_blank" rel="noreferrer">
                  Projeyi Gör
                </a>
              </p>
            </div>
          ))
        ) : (
          <p>Henüz proje eklenmedi</p>
        )}
      </div>

      {/* CARD FOOTER */}
      <div className="cardid-section">
        <div className="cardid-copy">
          <span>
            <strong>CardID:</strong> {cardid}
          </span>
          <button className="copy-btn" onClick={copyCardId}>
            <FaRegCopy />
          </button>
        </div>
        <div className="qr-wrapper">
          <QRCodeSVG
            value={cardid || "yok"}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
};

export default DigitalCard;
