import "./Testimonials.css";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { testimonials } from "../../data";
import { Autoplay } from "swiper/modules";
const Testimonials = () => {
  return (
    <section id="testimonials">
      <div className="glass-card">
        <div className="glass-card">
          <h2 className="shine">Testimonials</h2>
        </div>
        <Swiper
          slidesPerView={1}
          spaceBetween={40}
          autoplay={true}
          speed={3000}
          modules={[Autoplay]}
          breakpoints={{ 700: { slidesPerView: 2 } }}
        >
          {testimonials.map(({ avatar, name, review }, index) => (
            <SwiperSlide className="card testimonial" key={index}>
              <div className="avatar">
                <img src={avatar} alt="" />
              </div>
              <h3 className="name">{name}</h3>
              <p className="">{review}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
