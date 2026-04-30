document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation & Scroll Effects ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.padding = '0.8rem 0';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.8)';
            header.style.padding = '1rem 0';
        }
    });

    // --- Particles Effect ---
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 80;

        function initParticles() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            
            particles.forEach((p, i) => {
                p.x += p.speedX;
                p.y += p.speedY;
                if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
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

    // --- Photo Gallery Slider ---
    const sliderWrapper = document.querySelector('.photo-slider-wrapper');
    const slides = document.querySelectorAll('.photo-slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentSlide = 0;

    function updateSlider() {
        if (sliderWrapper) {
            sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        });
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
        });

        // Auto Slider
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }, 3500);
    }

    // --- Free Board (Firebase Realtime Database) ---
    const boardPostsContainer = document.getElementById('boardPosts');
    const boardForm = document.getElementById('freeBoardForm');
    const boardFormCard = document.getElementById('boardFormCard');
    const toggleWriteBtn = document.getElementById('toggleWriteBtn');
    const postCountEl = document.getElementById('postCount');

    function initFirebaseBoard() {
        console.log("Firebase Board Initializing...");
        if (!window.app || !window.firebaseDB) return;

        const { getDatabase, ref, push, set, onValue, remove, update } = window.firebaseDB;
        const db = getDatabase(window.app);
        const postsRef = ref(db, 'portfolio_posts');

        if (boardForm) {
            const newForm = boardForm.cloneNode(true);
            boardForm.parentNode.replaceChild(newForm, boardForm);
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('boardName').value.trim();
                const email = document.getElementById('boardEmail').value.trim();
                const password = document.getElementById('boardPassword').value.trim();
                const message = document.getElementById('boardMessage').value.trim();
                if (!name || !email || !password || !message) return;

                const newPostRef = push(postsRef);
                set(newPostRef, {
                    name, email, password, message,
                    date: new Date().toLocaleString('ko-KR'),
                    timestamp: Date.now(),
                    likes: 0
                }).then(() => {
                    newForm.reset();
                    if (boardFormCard) boardFormCard.style.display = 'none';
                    if (toggleWriteBtn) toggleWriteBtn.textContent = '✏️ 새 글 쓰기';
                }).catch(err => alert('오류가 발생했습니다: ' + err.message));
            });
        }

        onValue(postsRef, (snapshot) => {
            const data = snapshot.val();
            if (boardPostsContainer) boardPostsContainer.innerHTML = '';
            if (!data) {
                if (postCountEl) postCountEl.textContent = '0';
                return;
            }
            const posts = [];
            for (let id in data) posts.push({ id, ...data[id] });
            posts.sort((a, b) => b.timestamp - a.timestamp);
            if (postCountEl) postCountEl.textContent = posts.length;

            posts.forEach((post) => {
                const postEl = document.createElement('div');
                postEl.className = 'board-post glass-card';
                postEl.style.marginBottom = '1.5rem';
                postEl.style.padding = '1.5rem';
                const avatarChar = (post.name || '익').charAt(0).toUpperCase();
                postEl.innerHTML = `
                    <div class="post-header" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                        <div class="post-author-info" style="display: flex; gap: 1rem; align-items: center;">
                            <div class="author-avatar" style="width: 40px; height: 40px; background: #005596; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white;">${escapeHtml(avatarChar)}</div>
                            <div>
                                <div style="font-weight: 600;">${escapeHtml(post.name)}</div>
                                <div style="font-size: 0.8rem; color: #94a3b8;">${post.date}</div>
                            </div>
                        </div>
                        <button onclick="deletePost('${post.id}', '${post.password}')" style="background:none; border:none; cursor:pointer;">🗑️</button>
                    </div>
                    <div style="line-height:1.6; margin-bottom:1rem;">${escapeHtml(post.message)}</div>
                    <button onclick="likePost('${post.id}', ${post.likes || 0})" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:5px 12px; border-radius:15px; color:white; cursor:pointer;">👍 도움돼요 ${post.likes || 0}</button>
                `;
                boardPostsContainer.appendChild(postEl);
            });
        });

        window.deletePost = (postId, correctPw) => {
            const inputPw = prompt('비밀번호를 입력하세요:');
            if (inputPw === correctPw) {
                if (confirm('삭제하시겠습니까?')) remove(ref(db, `portfolio_posts/${postId}`));
            } else alert('비밀번호 불일치');
        };
        window.likePost = (postId, currentLikes) => {
            update(ref(db, `portfolio_posts/${postId}`), { likes: currentLikes + 1 });
        };
    }

    function escapeHtml(unsafe) {
        return unsafe.replace(/[&<"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
    }

    if (window.firebaseReady) initFirebaseBoard();
    else window.addEventListener('firebase-ready', initFirebaseBoard);

    if (toggleWriteBtn && boardFormCard) {
        toggleWriteBtn.addEventListener('click', () => {
            if (boardFormCard.style.display === 'none') {
                boardFormCard.style.display = 'block';
                toggleWriteBtn.textContent = '❌ 쓰기 취소';
            } else {
                boardFormCard.style.display = 'none';
                toggleWriteBtn.textContent = '✏️ 새 글 쓰기';
            }
        });
    }

    // --- AI Architect Assistant ---
    const chatToggle = document.getElementById('ai-chat-toggle');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');

    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
        });
        closeChat.addEventListener('click', () => { chatWindow.style.display = 'none'; });

        const handleSend = () => {
            const text = chatInput.value.trim();
            if (!text) return;
            const userMsg = document.createElement('div');
            userMsg.className = 'message user';
            userMsg.textContent = text;
            chatMessages.appendChild(userMsg);
            chatInput.value = '';
            
            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.className = 'message bot';
                botMsg.textContent = generateAIResponse(text);
                chatMessages.appendChild(botMsg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 600);
        };

        sendChat.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
    }

    function generateAIResponse(query) {
        const q = query.toLowerCase();
        if (q.includes('안녕') || q.includes('누구')) return '안녕하세요! 허태원 지원자의 AI 도우미입니다.';
        if (q.includes('기술') || q.includes('역량')) return '허태원님은 PLC 제어, SolidWorks 설계, Python/C++ 역량을 보유하고 있습니다.';
        if (q.includes('학점') || q.includes('성적')) return '전체 평점 4.32 / 4.5로 매우 우수한 성적을 유지하고 있습니다.';
        if (q.includes('목표') || q.includes('비전')) return '두산로보틱스에서 지능형 로봇 생태계를 혁신하는 것이 목표입니다.';
        return '허태원님의 학점, 기술 역량, 비전에 대해 질문해 보세요!';
    }
});
