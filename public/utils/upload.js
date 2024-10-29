function handleFileUpload() {
    const fileInput = document.getElementById('file-upload');
    const fileList = document.getElementById('file-list');
    const lottieContainer = document.getElementById('lottie-container');
    const uploaderImage = document.getElementById('uploader-image'); // Get the uploader image element

    fileInput.addEventListener('change', function(e) {
        fileList.innerHTML = '';
        const file = this.files[0]; // Get the first file (single file upload)
        if (file) {
            const fileItem = document.createElement('div');
            fileItem.className = 'flex items-center justify-between bg-gray-100 p-2 rounded';
            fileItem.innerHTML = `
                <span>${file.name}</span>
                <div>
                    <span class="text-gray-500 mr-2">${(file.size / 1024).toFixed(1)}kb</span>
                    <button class="text-red-500 hover:text-red-700" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;
            fileList.appendChild(fileItem);

            // Hide the uploader image
            uploaderImage.classList.add('hide');

            // Show Lottie animation
            lottieContainer.innerHTML = '';
            lottie.loadAnimation({
                container: lottieContainer,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/assets/file-loader.json'
            });

            // Create a FormData object and append the file
            const formData = new FormData();
            formData.append('file', file);

            // Make a POST request to the server
            fetch('https://loader.ohanapal.bot/langflow/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Upload response:', data);

                // Store data.path in local storage
                localStorage.setItem('file_path', data.path);

                // Disable the file input and change its text
                fileInput.disabled = true;
                fileInput.nextElementSibling.textContent = "File is Loaded. Let's chat!";

                // Stop Lottie animation
                lottieContainer.innerHTML = '';
            })
            .catch(error => {
                console.error('Error uploading file:', error);

                // Stop Lottie animation
                lottieContainer.innerHTML = '';
            });

            // Toggle visibility of chart and no data containers
            document.getElementById('chartContainer').classList.remove('hide');
            document.getElementById('noDataContainer').classList.add('hide');
            document.getElementById('dummyDataWarning').classList.remove('hide');
        }
    });
}

// Call the function to set up the file upload handler
handleFileUpload();