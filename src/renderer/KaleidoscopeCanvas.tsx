/* eslint-disable consistent-return */
// @ts-expect-error
import * as Kaleidos from 'kaleidos';
import { useEffect, useRef, useState } from 'react';

function KaleidoscopeCanvas() {
  const [selectedImage, setSelectedImage] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!selectedImage) return;

    const image = new Image();
    image.src = selectedImage;

    const options = {
      src: image,
      // radius: document.body.clientWidth / 1.6,
      offsetX: 0,
      offsetY: 0,
      offsetRotation: 0,
      slices: Math.round(Math.random() * 20) + 4,
      ease: 0.1,
    };

    const kaleidos = new Kaleidos(canvasRef.current, options);
    let tx = options.offsetX;
    let ty = options.offsetY;
    const tr = options.offsetRotation;

    // move move event to make changes in kaleidos effect
    const onMouseMove = (event: any) => {
      let dx = event.pageX / window.innerWidth;
      let dy = event.pageY / window.innerHeight;

      if (event.type === 'touchmove') {
        if (event.touches.length === 1) {
          const touch = event.touches[0];
          dx = touch.clientX / window.innerWidth;
          dy = touch.clientY / window.innerHeight;
        }
      }

      const hx = dx - 0.5;
      const hy = dy - 0.5;
      tx = hx * kaleidos.radius * -2;
      ty = hy * kaleidos.radius * 2;
    };

    // render the kaledios effect in canvas
    const render = () => {
      const delta = tr - kaleidos.offsetRotation;
      const theta = Math.atan2(Math.sin(delta), Math.cos(delta));

      kaleidos.offsetX += (tx - kaleidos.offsetX) * options.ease;
      kaleidos.offsetY += (ty - kaleidos.offsetY) * options.ease;
      kaleidos.offsetRotation +=
        (theta - kaleidos.offsetRotation) * options.ease;
      kaleidos.draw();
      requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onMouseMove);

    image.addEventListener('load', () => {
      kaleidos.initialize();
    });

    render();

    return () => {
      // Cleanup event listeners
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onMouseMove);
    };
  }, [selectedImage]); // Re-run effect when selectedImage changes

  // on input file change
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
    }
  };

  return (
    <div className="flexbox">
      <div className="row">
        <input
          className="item"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="row">
        <div className="item">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}

export default KaleidoscopeCanvas;
