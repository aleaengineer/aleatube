function downloadVideo() {
    const videoUrl = document.getElementById('videoUrl').value;
    const resultDiv = document.getElementById('result');
    
    if (!videoUrl) {
        resultDiv.innerHTML = `
            <div class="alert alert-warning">
                Please enter a YouTube URL
            </div>
        `;
        return;
    }

    const videoId = extractVideoId(videoUrl);
    
    if (!videoId) {
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                Invalid YouTube URL
            </div>
        `;
        return;
    }

    // Tampilkan preview dan link download
    resultDiv.innerHTML = `
        <div class="video-preview mb-4">
            <div class="ratio ratio-16x9">
                <iframe src="https://www.youtube.com/embed/${videoId}" 
                        title="YouTube video player" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            </div>
        </div>
        <div class="download-options">
            <a href="https://ripyoutube.com/watch?v=${videoId}" 
               class="btn btn-danger btn-lg w-100" 
               target="_blank">
                <i class="fas fa-download me-2"></i> Download Video
            </a>
            <div class="text-center mt-3">
                <small class="text-muted">Click button above to choose video quality</small>
            </div>
        </div>
    `;
}

function extractVideoId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
}

// Tambahkan fungsi untuk menampilkan preview video
function showVideoPreview(videoId) {
    const previewDiv = document.createElement('div');
    previewDiv.className = 'video-preview mt-4';
    previewDiv.innerHTML = `
        <div class="ratio ratio-16x9">
            <iframe src="https://www.youtube.com/embed/${videoId}" 
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
        </div>
        <div class="video-info mt-3" id="videoInfo">
            <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    
    document.getElementById('result').prepend(previewDiv);
    fetchVideoInfo(videoId);
}

// Fungsi untuk mengambil informasi video
async function fetchVideoInfo(videoId) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=AIzaSyB6Yb8abKJdEFOHvEnA5HwJ5gHx5eMngOM&part=snippet,statistics`);
        const data = await response.json();
        
        if (data.items && data.items[0]) {
            const videoInfo = data.items[0];
            displayVideoInfo(videoInfo);
        }
    } catch (error) {
        console.error('Error fetching video info:', error);
    }
}

// Fungsi untuk menampilkan informasi video
function displayVideoInfo(videoInfo) {
    const infoDiv = document.getElementById('videoInfo');
    infoDiv.innerHTML = `
        <h4>${videoInfo.snippet.title}</h4>
        <p class="text-muted">${videoInfo.snippet.channelTitle}</p>
        <div class="d-flex gap-3">
            <span><i class="fas fa-eye"></i> ${formatNumber(videoInfo.statistics.viewCount)} views</span>
            <span><i class="fas fa-thumbs-up"></i> ${formatNumber(videoInfo.statistics.likeCount)}</span>
        </div>
    `;
}

// Fungsi untuk memformat angka
function formatNumber(num) {
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
}