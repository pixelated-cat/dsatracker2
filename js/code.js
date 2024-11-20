const runCodeBtn = document.getElementById("runCodeBtn");
const outputElement = document.getElementById("output");


runCodeBtn.addEventListener("click", () => {
    const code = document.getElementById("codeInput").value;
    const language = document.getElementById("langSelect").value;
    

    outputElement.textContent = "Running...";
    outputElement.style.color = "blue"; 

    
    let pistonLang;
    switch (language) {
        case "c": pistonLang = "c"; break;
        case "cpp": pistonLang = "cpp"; break;
        case "java": pistonLang = "java"; break;
        case "python3": pistonLang = "python"; break;
        default: pistonLang = "cpp";
    }

    
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('id');

    
    fetch("problem.json") 
        .then(response => response.json())
        .then(problems => {
            const testCase = problems[questionId]; 
            if (!testCase) {
                outputElement.textContent = "Test case not found!";
                outputElement.style.color = "red";
                return;
            }
            const input = testCase.input;
            const expectedOutput = testCase.output;

            
            fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    language: pistonLang,
                    version: "*", 
                    files: [{ content: code }],
                    stdin: input
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log("API Response:", data); 

                if (data.run && data.run.output) {
                    const result = data.run.output.trim();
                    if (result === expectedOutput.trim()) {
                        outputElement.textContent = "Correct!";
                        outputElement.style.color = "green";
                    } else {
                        outputElement.textContent = "Wrong Output!";
                        outputElement.style.color = "red";
                    }
                } else {
                    outputElement.textContent = "Execution Error!";
                    outputElement.style.color = "red";
                }
            })
            .catch(err => {
                console.error("Error executing code:", err);
                outputElement.textContent = "Error executing code!";
                outputElement.style.color = "red";
            });
        })
        .catch(err => {
            console.error("Error loading test case:", err);
            outputElement.textContent = "Error loading test case!";
            outputElement.style.color = "red";
        });
});
