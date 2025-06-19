import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const testimonials = [
  {
    quote: "Environment Direct has revolutionized how we approach conservation in our community. The real-time data is a game-changer!",
    name: "Dr. Anya Sharma",
    title: "Lead Scientist, Dominica Conservation Trust",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    quote: "The training programs are top-notch. Our team is now more equipped than ever to tackle environmental challenges head-on.",
    name: "Johnathan Lee",
    title: "Director of Operations, EcoScapes Ltd.",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg"
  },
  {
    quote: "An invaluable resource for anyone passionate about protecting Dominica's natural beauty. The interactive map is my favorite feature.",
    name: "Maria Garcia",
    title: "Local Environmental Advocate",
    avatar: "https://randomuser.me/api/portraits/women/47.jpg"
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-envGreen-700 dark:bg-envGreen-800 py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          What Our Partners Say
        </h2>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper testimonials-swiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="max-w-3xl mx-auto text-center p-8">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/30" />
                <p className="text-lg italic text-white/90 mb-6">"{testimonial.quote}"</p>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-white/70">{testimonial.title}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .testimonials-swiper .swiper-button-next,
          .testimonials-swiper .swiper-button-prev {
            color: white !important;
          }
          
          .testimonials-swiper .swiper-button-next:after,
          .testimonials-swiper .swiper-button-prev:after {
            font-size: 20px;
          }
          
          .testimonials-swiper .swiper-pagination-bullet {
            background: rgba(255, 255, 255, 0.5) !important;
          }
          
          .testimonials-swiper .swiper-pagination-bullet-active {
            background: white !important;
          }
          
          .testimonials-swiper .swiper-button-next.swiper-button-disabled,
          .testimonials-swiper .swiper-button-prev.swiper-button-disabled {
            opacity: 0.3;
          }
        `
      }} />
    </section>
  );
};

export default TestimonialsSection; 