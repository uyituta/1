document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('prostateTest');
    const resultDiv = document.getElementById('result');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateResults();
    });
});

function calculateResults() {
    const form = document.getElementById('prostateTest');
    const formData = new FormData(form);
    
    // Validate all questions are answered
    const requiredQuestions = 15;
    let answeredQuestions = 0;
    
    for (let i = 1; i <= requiredQuestions; i++) {
        if (formData.get(`q${i}`)) {
            answeredQuestions++;
        }
    }
    
    if (answeredQuestions < requiredQuestions) {
        alert('Por favor, responde todas las preguntas para obtener un resultado preciso.');
        return;
    }
    
    // Calculate I-PSS score (questions 1-7)
    let ipssScore = 0;
    for (let i = 1; i <= 7; i++) {
        ipssScore += parseInt(formData.get(`q${i}`)) || 0;
    }
    
    // Quality of life score (question 8)
    const qolScore = parseInt(formData.get('q8')) || 0;
    
    // Risk factors score (questions 9-15)
    let riskScore = 0;
    for (let i = 9; i <= 15; i++) {
        riskScore += parseInt(formData.get(`q${i}`)) || 0;
    }
    
    // Calculate total score and determine risk level
    const totalScore = ipssScore + riskScore + Math.floor(qolScore / 2);
    
    let riskLevel, resultClass, recommendations;
    
    if (totalScore <= 7) {
        riskLevel = 'BAJO';
        resultClass = 'result-low';
        recommendations = `
            <h3>✅ Riesgo Bajo - Salud Prostática Óptima</h3>
            <p><strong>Tu puntuación: ${totalScore}/35 puntos</strong></p>
            <p><strong>I-PSS Score: ${ipssScore}/35</strong> - Síntomas leves o ausentes</p>
            <p><strong>Calidad de vida:</strong> ${getQualityOfLifeText(qolScore)}</p>
            
            <div class="recommendations">
                <h4>🎯 Recomendaciones para mantener tu salud prostática:</h4>
                <ul>
                    <li>✅ Mantén una dieta rica en frutas, verduras y ácidos grasos omega-3</li>
                    <li>✅ Continúa con el ejercicio regular para fortalecer el suelo pélvico</li>
                    <li>✅ Mantén un peso saludable</li>
                    <li>✅ Realiza chequeos preventivos anuales después de los 40 años</li>
                    <li>✅ Considera suplementos naturales como Saw Palmetto y Zinc</li>
                </ul>
                
                <h4>🌿 Productos naturales recomendados:</h4>
                <p>Nuestras gomitas y suplementos naturales pueden ayudarte a mantener este excelente estado de salud prostática.</p>
            </div>
        `;
    } else if (totalScore <= 19) {
        riskLevel = 'MODERADO';
        resultClass = 'result-medium';
        recommendations = `
            <h3>⚠️ Riesgo Moderado - Atención Requerida</h3>
            <p><strong>Tu puntuación: ${totalScore}/35 puntos</strong></p>
            <p><strong>I-PSS Score: ${ipssScore}/35</strong> - Síntomas moderados</p>
            <p><strong>Calidad de vida:</strong> ${getQualityOfLifeText(qolScore)}</p>
            
            <div class="recommendations">
                <h4>🎯 Recomendaciones importantes:</h4>
                <ul>
                    <li>⚠️ Consulta con un urólogo para evaluación más detallada</li>
                    <li>🥗 Mejora tu dieta: reduce carnes rojas, aumenta vegetales</li>
                    <li>💧 Controla la ingesta de líquidos antes de dormir</li>
                    <li>🏃‍♂️ Incrementa la actividad física, especialmente ejercicios pélvicos</li>
                    <li>🚭 Elimina tabaco y reduce alcohol</li>
                    <li>😴 Mejora la calidad del sueño</li>
                </ul>
                
                <h4>🌿 Tratamiento natural recomendado:</h4>
                <p>Nuestros productos con Saw Palmetto, Pygeum Africanum y Zinc pueden ayudar significativamente a reducir los síntomas prostáticos.</p>
                
                <div class="urgent-note">
                    <p><strong>📞 Recomendamos una consulta médica dentro de 1-3 meses.</strong></p>
                </div>
            </div>
        `;
    } else {
        riskLevel = 'ALTO';
        resultClass = 'result-high';
        recommendations = `
            <h3>🚨 Riesgo Alto - Atención Médica Urgente</h3>
            <p><strong>Tu puntuación: ${totalScore}/35 puntos</strong></p>
            <p><strong>I-PSS Score: ${ipssScore}/35</strong> - Síntomas severos</p>
            <p><strong>Calidad de vida:</strong> ${getQualityOfLifeText(qolScore)}</p>
            
            <div class="recommendations">
                <h4>🚨 Acciones inmediatas requeridas:</h4>
                <ul>
                    <li>🏥 <strong>URGENTE:</strong> Consulta con un urólogo lo antes posible</li>
                    <li>🔬 Solicita exámenes: PSA, tacto rectal, ecografía prostática</li>
                    <li>💊 Considera tratamiento médico bajo supervisión</li>
                    <li>📊 Monitoreo regular de síntomas</li>
                    <li>🥗 Cambios dietéticos inmediatos</li>
                    <li>💧 Control estricto de la hidratación</li>
                </ul>
                
                <h4>🌿 Apoyo con productos naturales:</h4>
                <p>Mientras recibes atención médica, nuestros productos naturales pueden servir como complemento al tratamiento profesional.</p>
                
                <div class="urgent-note">
                    <p><strong>📞 IMPORTANTE: Programa una cita médica dentro de 2-4 semanas máximo.</strong></p>
                    <p><strong>🚨 Si experimentas dolor intenso, sangre en la orina o retención urinaria, busca atención médica inmediata.</strong></p>
                </div>
            </div>
        `;
    }
    
    // Show results
    const resultDiv = document.getElementById('result');
    const resultTitle = document.getElementById('resultTitle');
    const resultContent = document.getElementById('resultContent');
    
    resultDiv.className = `result ${resultClass}`;
    resultTitle.textContent = `Resultado: Riesgo ${riskLevel}`;
    resultContent.innerHTML = recommendations;
    
    resultDiv.style.display = 'block';
    
    // Scroll to results
    setTimeout(() => {
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
    // Track results for analytics (optional)
    trackTestResults(totalScore, ipssScore, riskLevel);
}

function getQualityOfLifeText(score) {
    const qualityTexts = {
        0: 'Muy satisfecho',
        1: 'Satisfecho', 
        2: 'Más satisfecho que insatisfecho',
        3: 'Igual de satisfecho que insatisfecho',
        4: 'Más insatisfecho que satisfecho',
        5: 'Insatisfecho',
        6: 'Muy insatisfecho'
    };
    return qualityTexts[score] || 'No evaluado';
}

function trackTestResults(totalScore, ipssScore, riskLevel) {
    // This function can be used to track test results for analytics
    // For now, we'll just log to console
    console.log('Test Results:', {
        totalScore,
        ipssScore,
        riskLevel,
        timestamp: new Date().toISOString()
    });
    
    // Could be extended to send data to analytics service
    // or save to localStorage for user tracking
    const testHistory = JSON.parse(localStorage.getItem('prostateTestHistory') || '[]');
    testHistory.push({
        totalScore,
        ipssScore,
        riskLevel,
        date: new Date().toISOString().split('T')[0]
    });
    localStorage.setItem('prostateTestHistory', JSON.stringify(testHistory));
}

// Form validation and user experience improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add progress indicator
    const form = document.getElementById('prostateTest');
    const questions = form.querySelectorAll('.question');
    let answeredCount = 0;
    
    questions.forEach((question, index) => {
        const inputs = question.querySelectorAll('input[type="radio"]');
        inputs.forEach(input => {
            input.addEventListener('change', function() {
                // Mark question as answered
                if (!question.classList.contains('answered')) {
                    question.classList.add('answered');
                    answeredCount++;
                    updateProgress();
                }
            });
        });
    });
    
    function updateProgress() {
        const progress = (answeredCount / questions.length) * 100;
        let progressBar = document.getElementById('progressBar');
        
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'progressBar';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 4px;
                background: #2d5a27;
                transition: width 0.3s ease;
                z-index: 1000;
            `;
            document.body.appendChild(progressBar);
        }
        
        progressBar.style.width = progress + '%';
        
        if (progress === 100) {
            setTimeout(() => {
                progressBar.style.background = '#5a8a52';
            }, 300);
        }
    }
});

// Add smooth scrolling between questions
function scrollToNextUnanswered() {
    const unansweredQuestions = document.querySelectorAll('.question:not(.answered)');
    if (unansweredQuestions.length > 0) {
        unansweredQuestions[0].scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
}

// Auto-scroll to next question when one is answered
document.addEventListener('change', function(e) {
    if (e.target.type === 'radio') {
        setTimeout(() => {
            scrollToNextUnanswered();
        }, 500);
    }
});
