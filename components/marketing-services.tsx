import { CameraIcon, ChartIcon, DroneIcon, TourIcon, VideoIcon } from "./icons";

const services = [
  { title: "Photography", copy: "Editorial-quality imagery that creates a powerful first impression.", Icon: CameraIcon },
  { title: "Drone Aerials", copy: "A compelling view of the property, setting, and surrounding lifestyle.", Icon: DroneIcon },
  { title: "3D Tours", copy: "Immersive, always-open showings for serious buyers near and far.", Icon: TourIcon },
  { title: "Cinematic Video", copy: "Story-driven property films designed to stop the scroll.", Icon: VideoIcon },
  { title: "Digital Campaigns", copy: "Targeted distribution built to earn attention beyond the MLS.", Icon: ChartIcon },
];

export function MarketingServices() {
  return (
    <div className="service-grid">
      {services.map(({ title, copy, Icon }, index) => (
        <article className="service-card" key={title}>
          <span className="service-number">0{index + 1}</span>
          <Icon className="service-icon" />
          <h3>{title}</h3>
          <p>{copy}</p>
        </article>
      ))}
    </div>
  );
}
