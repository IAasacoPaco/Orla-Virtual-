document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalName = document.getElementById('modalName');
    const closeBtn = document.querySelector('.close');
    const studentCards = document.querySelectorAll('.student-card');

    // Configurar videos iniciales
    initializeVideos();

    // Event listeners para las tarjetas de estudiantes
    studentCards.forEach(card => {
        card.addEventListener('click', function() {
            openVideoModal(this);
        });

        // También permitir click en el nombre
        const nameElement = card.querySelector('.student-name');
        if (nameElement) {
            nameElement.addEventListener('click', function(e) {
                e.stopPropagation();
                openVideoModal(card);
            });
        }
    });

    // Event listeners para el modal
    closeBtn.addEventListener('click', closeVideoModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeVideoModal();
        }
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeVideoModal();
        }
    });

    /**
     * Inicializar configuración de videos
     */
    function initializeVideos() {
        const videos = document.querySelectorAll('.student-video');
        
        videos.forEach(video => {
            // Configurar propiedades iniciales
            video.muted = true;
            video.loop = true;
            video.autoplay = true;
            video.playsInline = true;
            
            // Intentar reproducir el video
            video.play().catch(error => {
                console.log('Error al reproducir video:', error);
                // Si falla la reproducción automática, mostrar poster o imagen por defecto
                video.poster = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><rect width="100" height="120" fill="%23f0f0f0"/><circle cx="50" cy="60" r="20" fill="%23ccc"/><polygon points="45,50 45,70 65,60" fill="%23999"/></svg>';
            });

            // Hover effects
            video.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });

            video.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    /**
     * Abrir modal con video ampliado
     */
    function openVideoModal(card) {
        const video = card.querySelector('.student-video');
        const name = card.querySelector('.student-name').textContent;
        const videoSrc = video.querySelector('source').src;
        
        // Configurar modal
        modalVideo.src = videoSrc;
        modalName.textContent = name;
        
        // Configurar video del modal
        modalVideo.muted = false;
        modalVideo.loop = false;
        modalVideo.controls = true;
        modalVideo.autoplay = true;
        
        // Mostrar modal con animación
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Pausar video original
        video.pause();
        
        // Reproducir video del modal
        modalVideo.play().catch(error => {
            console.log('Error al reproducir video en modal:', error);
        });

        // Añadir efecto de zoom suave
        setTimeout(() => {
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    }

    /**
     * Cerrar modal de video
     */
    function closeVideoModal() {
        // Pausar video del modal
        modalVideo.pause();
        modalVideo.currentTime = 0;
        
        // Ocultar modal
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reanudar videos originales
        const videos = document.querySelectorAll('.student-video');
        videos.forEach(video => {
            if (video.paused) {
                video.play().catch(error => {
                    console.log('Error al reanudar video:', error);
                });
            }
        });
    }

    /**
     * Manejar errores de carga de video
     */
    function handleVideoError(video, studentName) {
        console.log(`Error cargando video para ${studentName}`);
        
        // Crear elemento de placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'video-placeholder';
        placeholder.style.cssText = `
            width: 100px;
            height: 120px;
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
            border: 3px solid #8b4513;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 12px;
            text-align: center;
            cursor: pointer;
        `;
        
        placeholder.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 5px;">📹</div>
            <div>Video no<br>disponible</div>
        `;
        
        // Reemplazar video con placeholder
        video.parentNode.replaceChild(placeholder, video);
    }

    /**
     * Verificar disponibilidad de videos
     */
    function checkVideoAvailability() {
        const videos = document.querySelectorAll('.student-video');
        
        videos.forEach(video => {
            video.addEventListener('error', function() {
                const card = this.closest('.student-card');
                const studentName = card.querySelector('.student-name').textContent;
                handleVideoError(this, studentName);
            });
            
            video.addEventListener('loadeddata', function() {
                console.log(`Video cargado correctamente para: ${this.closest('.student-card').querySelector('.student-name').textContent}`);
            });
        });
    }

    // Verificar disponibilidad de videos
    checkVideoAvailability();

    /**
     * Funciones de utilidad para debugging
     */
    window.orlaDebug = {
        listMissingVideos: function() {
            const videos = document.querySelectorAll('.student-video');
            const missing = [];
            
            videos.forEach(video => {
                const src = video.querySelector('source').src;
                const name = video.closest('.student-card').querySelector('.student-name').textContent;
                
                fetch(src, { method: 'HEAD' })
                    .then(response => {
                        if (!response.ok) {
                            missing.push({ name, src });
                        }
                    })
                    .catch(() => {
                        missing.push({ name, src });
                    });
            });
            
            setTimeout(() => {
                console.log('Videos faltantes:', missing);
            }, 1000);
        },
        
        testAllVideos: function() {
            const videos = document.querySelectorAll('.student-video');
            videos.forEach(video => {
                video.play().then(() => {
                    console.log('✓ Video OK:', video.closest('.student-card').querySelector('.student-name').textContent);
                }).catch(error => {
                    console.log('✗ Video Error:', video.closest('.student-card').querySelector('.student-name').textContent, error);
                });
            });
        }
    };

    // Mensaje de bienvenida en consola
    console.log('🎓 Orla Digital Master AI - Del Zero al Hack 2025');
    console.log('📹 Videos configurados correctamente');
    console.log('🔧 Usa orlaDebug.listMissingVideos() para verificar videos faltantes');
    console.log('🔧 Usa orlaDebug.testAllVideos() para probar todos los videos');
});

