async function sendMessageToAI(message, filePath) {
    //add user message to chat container
    const chatMessagesContainer = document.getElementById('chatMessages');
    chatMessagesContainer.innerHTML += `
        <div class="mb-4">
            <p class="bg-blue-100 text-sm text-blue-800 rounded-lg p-3 inline-block">${message}</p>
         </div>
    `;

     // Show skeleton loader
    //  const skeletonLoader = document.createElement('div');
    //  skeletonLoader.className = 'skeleton-loader';
    //  skeletonLoader.id = 'skeletonLoader';
    //  chatMessagesContainer.appendChild(skeletonLoader);

    const skeletonLoaderContainer = document.createElement('div');
    skeletonLoaderContainer.id = 'skeletonLoaderContainer';
    skeletonLoaderContainer.innerHTML = `<div class="skeleton-loader"></div><div class="skeleton-loader skeleton-2"></div>`;
    chatMessagesContainer.appendChild(skeletonLoaderContainer);

    const url = 'https://flow.ohanapal.bot/api/v1/run/c217e367-6211-4503-aae0-a7df221e42c3?stream=false';
    const body = {
        "input_value": message,
        "output_type": "chat",
        "input_type": "chat",
        "tweaks": {
            "CSVAgent-XCW00": {
                "path": filePath,
                "agent_type": "openai-tools",
                "handle_parsing_errors": true,
                "input_value": "",
                "max_iterations": 15,
                "verbose": true
            },
            "OpenAIModel-YdPAD": {
                "api_key": "OPENAI_API_KEY", 
                "input_value": "",
                "json_mode": false,
                "max_tokens": null,
                "model_kwargs": {},
                "model_name": "gpt-4o-mini",
                "openai_api_base": "",
                "output_schema": {},
                "seed": 1,
                "stream": false,
                "system_message": "",
                "temperature": 0.1
            },
            "ChatOutput-iOaWX": {
                "data_template": "{text}",
                "input_value": "",
                "sender": "Machine",
                "sender_name": "AI",
                "session_id": "",
                "should_store_message": true
            }
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.log(response.status);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const preResultText = data.outputs[0].outputs[0].results.message.text;
        const resultText = preResultText.replace(/^"|"$/g, ''); // Remove quotes at start and end
        console.log(resultText);
        
        // Use regex to extract text before "*Chart Data:*"
        const regexBefore = /([\s\S]*?)(?=\*Chart Data:\*)/;
        const matchBefore = resultText.match(regexBefore);
        const mainText = matchBefore ? matchBefore[1] : '';
        console.log(mainText);
        

        // Use regex to extract text after "*Chart Data:*"
        const regexAfter = /\*Chart Data:\*([\s\S]*)/;
        const matchAfter = resultText.match(regexAfter);
        const chartText = matchAfter ? matchAfter[1].trim() : '';
        // console.log(chartText);

        // Extract text between ```json and ```
        const regexCleaned = /```json([\s\S]*?)```/;
        const matchCleaned = chartText.match(regexCleaned);
        // const cleanedChartText = matchCleaned ? matchCleaned[1].trim() : '';
       const cleanedChartText = chartText;
        console.log(cleanedChartText);
        const chartData = JSON.parse(cleanedChartText);
        // console.log(chartData);

        skeletonLoaderContainer.remove();

        // Insert mainText into the chatMessages container
        const chatMessagesContainer = document.getElementById('chatMessages');
        chatMessagesContainer.innerHTML += `
            <div class="mb-4">
                <div class="flex items-start">
                    <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">AI</p>
                        <p class="text-sm text-gray-500 tlt">${mainText}</p>
                    </div>
                </div>
            </div>
        `;

        var tltElements = document.querySelectorAll('.tlt');
        
        $('.tlt').textillate();

        setTimeout(() => {
            tltElements.forEach(element => {
                element.classList.remove('tlt');
            });
        }, 10000);



        chatMessages.scrollTop = chatMessages.scrollHeight;

        return chartData;

    } catch (error) {
        alert("Error: " + "The Analysis Failed. Please try again.");
        console.error('Error:', error);
    }
}
