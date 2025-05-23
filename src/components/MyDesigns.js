import React, { useState } from "react";
import "../CSS/CardDesign1.css";

const MyDesigns = ({
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
  const maxLength = 150; // Gösterilecek karakter sayısı

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const isLong = about && about.length > maxLength;
  const displayedText = !isLong
    ? about
    : expanded
    ? about
    : about.substring(0, maxLength) + "...";

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
          <div className={`placeholder-text${designindex}`}>Profil Resmi Yok</div>
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
        <b>Email:</b> {email || "-"}
      </p>
      <p>
        <b>Telefon:</b> {phone || "-"}
      </p>

      <p>
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
        {github && (
          <a href={github} target="_blank" rel="noreferrer">
            Github
          </a>
        )}
        {website && (
          <a href={website} target="_blank" rel="noreferrer">
            Websitesi
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
    </div>
  );
};

export default MyDesigns;
