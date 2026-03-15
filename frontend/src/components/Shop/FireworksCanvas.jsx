import { useEffect, useRef } from "react";

export default function FireworksCanvas() {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const rockets = useRef([]);
    const animFrame = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        const resize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);
        const colors = ["#FFD700", "#FF6B35", "#FF1744", "#FF9800", "#E91E63", "#FFEB3B", "#FF5722", "#FFF176", "#FFCA28", "#FF8A65"];
        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 1;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.decay = Math.random() * 0.02 + 0.012;
                this.size = Math.random() * 3 + 1;
                this.gravity = 0.08;
                this.trail = [];
            }
            update() {
                this.trail.push({
                    x: this.x,
                    y: this.y,
                    alpha: this.alpha
                });
                if (this.trail.length > 5) this.trail.shift();
                this.vy += this.gravity;
                this.vx *= 0.99;
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }
            draw(ctx) {
                this.trail.forEach((p, i) => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, this.size * (i / this.trail.length) * 0.5, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.globalAlpha = p.alpha * 0.3;
                    ctx.fill();
                });
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 6;
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
            }
        }
        class Rocket {
            constructor() {
                this.x = Math.random() * W;
                this.y = H;
                this.targetY = Math.random() * (H * 0.5) + 50;
                this.speed = Math.random() * 4 + 3;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.exploded = false;
                this.trail = [];
            }
            update() {
                this.trail.push({
                    x: this.x,
                    y: this.y
                });
                if (this.trail.length > 8) this.trail.shift();
                this.y -= this.speed;
                if (this.y <= this.targetY) this.exploded = true;
            }
            draw(ctx) {
                this.trail.forEach((p, i) => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, i / this.trail.length * 2, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.globalAlpha = i / this.trail.length * 0.5;
                    ctx.fill();
                });
                ctx.globalAlpha = 1;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = "#fff";
                ctx.fill();
            }
            explode() {
                const count = Math.floor(Math.random() * 80) + 60;
                for (let i = 0; i < count; i++) particles.current.push(new Particle(this.x, this.y, this.color));
            }
        }
        let frameCount = 0;
        const animate = () => {
            animFrame.current = requestAnimationFrame(animate);
            ctx.fillStyle = "rgba(5, 0, 15, 0.18)";
            ctx.fillRect(0, 0, W, H);
            frameCount++;
            if (frameCount % 45 === 0) rockets.current.push(new Rocket());
            rockets.current = rockets.current.filter(r => {
                r.update();
                r.draw(ctx);
                if (r.exploded) {
                    r.explode();
                    return false;
                }
                return true;
            });
            particles.current = particles.current.filter(p => {
                p.update();
                p.draw(ctx);
                return p.alpha > 0;
            });
        };
        animate();
        return () => {
            cancelAnimationFrame(animFrame.current);
            window.removeEventListener("resize", resize);
        };
    }, []);
    return <canvas ref={canvasRef} className="idx-style-1" />;
}
