document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const bars = document.querySelectorAll('.bar');
        if (navLinks.classList.contains('active')) {
            bars[0].style.transform = 'translateY(8px) rotate(45deg)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
        } else {
            bars[0].style.transform = 'translateY(0) rotate(0)';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'translateY(0) rotate(0)';
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const bars = document.querySelectorAll('.bar');
            bars[0].style.transform = 'translateY(0) rotate(0)';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'translateY(0) rotate(0)';
        });
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(2, 6, 23, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(2, 6, 23, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Advanced Artifact Slider
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const sliderDots = document.getElementById('sliderDots');
    let currentSlide = 0;

    // Initialize Dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot-btn');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });

    const updateDots = () => {
        document.querySelectorAll('.dot-btn').forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    const goToSlide = (index) => {
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        if (currentSlide >= slides.length) currentSlide = 0;
        slides[currentSlide].classList.add('active');
        updateDots();
        
        // Use currentSlide to toggle specific dynamic images in the sidebar
        const sideImgUR = document.getElementById('sideImgUR');
        if (sideImgUR) {
            sideImgUR.style.display = (currentSlide === 2) ? 'block' : 'none';
        }
    };

    prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
    });

    // Auto Slide (Optional)
    let slideInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 5000);

    // Pause Auto Slide on hover
    const artifactSlider = document.getElementById('artifactSlider');
    if (artifactSlider) {
        artifactSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        artifactSlider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000);
        });
    }

    // Scroll Animation Observer for Sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('info-card')) {
                    const bars = entry.target.querySelectorAll('.progress-fill');
                    bars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.info-card, .feature-list li, .vision-card, .glass-card, .metric-box');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
        observer.observe(el);
    });

    // --- UPGRADES ---
    // Scroll Progress
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);
    window.addEventListener('scroll', () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = progress + '%';
    });

    // Ambient Cursor Glow
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
    let glowX = targetX, glowY = targetY;
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });
    function updateGlow() {
        glowX += (targetX - glowX) * 0.1;
        glowY += (targetY - glowY) * 0.1;
        glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
        requestAnimationFrame(updateGlow);
    }
    updateGlow();

    // Typewriter for Hero Code
    const codeBlock = document.querySelector('.glass-card pre code');
    if (codeBlock) {
        const originalHTML = codeBlock.innerHTML;
        codeBlock.innerHTML = '';
        let i = 0;
        let isTag = false;
        let currentHTML = '';
        const typeWriter = setInterval(() => {
            if (i < originalHTML.length) {
                const char = originalHTML.charAt(i);
                currentHTML += char;
                if (char === '<') isTag = true;
                if (char === '>') isTag = false;
                if (!isTag) {
                    codeBlock.innerHTML = currentHTML + '<span class="cursor" style="opacity: 0.5;">|</span>';
                }
                i++;
            } else {
                clearInterval(typeWriter);
                codeBlock.innerHTML = currentHTML;
            }
        }, 15);
    }

    // --- HTML5 Canvas Particle Network ---
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const canvas = document.createElement('canvas');
        canvas.id = 'particles-bg';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '0';
        canvas.style.pointerEvents = 'none';
        heroSection.insertBefore(canvas, heroSection.firstChild);
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        function initParticles() {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
            particles = [];
            const numParticles = window.innerWidth < 768 ? 30 : 80;
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8,
                    radius: Math.random() * 1.5 + 0.5
                });
            }
        }
        
        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(96, 165, 250, 0.4)';
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.15)';
            
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
                
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(drawParticles);
        }
        initParticles();
        drawParticles();
        window.addEventListener('resize', initParticles);
    }

    // --- 3D Magnetic Tilt Effect ---
    const tiltCards = document.querySelectorAll('.info-card, .vision-card, .glass-card, .contact-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease-out';
        });
    });

    // --- Free Board (LocalStorage) ---
    const boardForm = document.getElementById('freeBoardForm');
    const boardFormCard = document.getElementById('boardFormCard');
    const toggleWriteBtn = document.getElementById('toggleWriteBtn');
    const boardPostsContainer = document.getElementById('boardPosts');
    const postCountEl = document.getElementById('postCount');

    if (toggleWriteBtn && boardFormCard) {
        toggleWriteBtn.addEventListener('click', () => {
            if (boardFormCard.style.display === 'none') {
                boardFormCard.style.display = 'block';
                boardFormCard.scrollIntoView({ behavior: 'smooth' });
                toggleWriteBtn.textContent = '❌ 쓰기 취소';
            } else {
                boardFormCard.style.display = 'none';
                toggleWriteBtn.textContent = '✏️ 새 글 쓰기';
            }
        });
    }

    const STORAGE_KEY = 'amk_portfolio_board_posts';

    // Load initial posts
    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if(boardPostsContainer) boardPostsContainer.innerHTML = '';
        
        if(postCountEl) postCountEl.textContent = posts.length;

        if (posts.length === 0 && boardPostsContainer) {
            boardPostsContainer.innerHTML = '<div class="empty-state">아직 등록된 게시물이 없습니다. 첫 번째 게시물을 남겨주세요!</div>';
            return;
        }

        posts.forEach((post, index) => {
            const postEl = document.createElement('div');
            postEl.className = 'board-post';
            
            let repliesHtml = '';
            const comments = post.comments || [];
            if (post.reply && comments.length === 0) {
                // Migrate old reply to comments format if needed
                comments.push({ name: 'AMK 담당자', text: post.reply, date: post.replyDate || '' });
            }

            if (comments.length > 0) {
                repliesHtml = '<div class="post-replies">';
                comments.forEach(c => {
                    repliesHtml += `
                        <div class="reply-item">
                            <div class="post-header">
                                <span class="post-author">${escapeHtml(c.name)}</span>
                                <span class="post-date">${c.date}</span>
                            </div>
                            <div class="post-body">${escapeHtml(c.text)}</div>
                        </div>
                    `;
                });
                repliesHtml += '</div>';
            }

            const likes = post.likes || 0;
            const dislikes = post.dislikes || 0;

            postEl.innerHTML = `
                <div class="post-header">
                    <div>
                        <span class="post-author">${escapeHtml(post.name)}</span>
                        <span class="post-email">&lt;${escapeHtml(post.email)}&gt;</span>
                    </div>
                    <div class="post-menu-actions">
                        <span class="post-date">${post.date}</span>
                        <button class="action-text-btn edit-btn" onclick="window.editPost(${index})">수정</button>
                        <button class="action-text-btn del-btn" onclick="window.deletePost(${index})">삭제</button>
                    </div>
                </div>
                <div class="post-body">${escapeHtml(post.message)}</div>
                <div class="post-interactions">
                    <button class="like-btn" onclick="window.likePost(${index})">👍 좋아요 <span class="count">${likes}</span></button>
                    <button class="dislike-btn" onclick="window.dislikePost(${index})">👎 싫어요 <span class="count">${dislikes}</span></button>
                    <button class="comment-btn" onclick="window.addComment(${index})">💬 댓글 달기 <span class="count">${comments.length > 0 ? comments.length : ''}</span></button>
                </div>
                ${repliesHtml}
            `;
            if(boardPostsContainer) boardPostsContainer.appendChild(postEl);
        });
    }

    // Add new post
    if (boardForm) {
        boardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('boardName').value.trim();
            const email = document.getElementById('boardEmail').value.trim();
            const message = document.getElementById('boardMessage').value.trim();

            if (!name || !email || !message) return;

            const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            
            const newPost = {
                name,
                email,
                message,
                date: new Date().toLocaleString('ko-KR'),
                likes: 0,
                dislikes: 0,
                comments: []
            };

            // Add to beginning of array
            posts.unshift(newPost);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));

            // Reset form and reload
            boardForm.reset();
            if (boardFormCard) {
                boardFormCard.style.display = 'none';
            }
            if (toggleWriteBtn) {
                toggleWriteBtn.textContent = '✏️ 새 글 쓰기';
            }
            loadPosts();
        });
    }

    // Helpers for Interactions
    window.editPost = function(index) {
        const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (posts[index]) {
            const newMsg = prompt('게시물을 수정하세요:', posts[index].message);
            if (newMsg && newMsg.trim()) {
                posts[index].message = newMsg.trim();
                localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
                loadPosts();
            }
        }
    };

    window.addComment = function(index) {
        const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (posts[index]) {
            const commenter = prompt('이름을 입력하세요 (미입력시 익명):') || '익명';
            const commentText = prompt('댓글 내용을 입력하세요:');
            if (commentText && commentText.trim()) {
                if (!posts[index].comments) posts[index].comments = [];
                posts[index].comments.push({
                    name: commenter.trim(),
                    text: commentText.trim(),
                    date: new Date().toLocaleString('ko-KR')
                });
                localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
                loadPosts();
            }
        }
    };

    window.likePost = function(index) {
        const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (posts[index]) {
            posts[index].likes = (posts[index].likes || 0) + 1;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
            loadPosts();
        }
    };

    window.dislikePost = function(index) {
        const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (posts[index]) {
            posts[index].dislikes = (posts[index].dislikes || 0) + 1;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
            loadPosts();
        }
    };

    // Helper: Delete Post
    window.deletePost = function(index) {
        if (confirm('이 게시물을 정말 삭제하시겠습니까?')) {
            const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            posts.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
            loadPosts();
        }
    };

    // Helper: escape HTML to prevent XSS
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    if (boardPostsContainer) {
        loadPosts();
    }
});
