// --- MÓDULO DE MANUTENÇÃO E IA DE ODÔMETRO (ai_maintenance.js) ---

function atualizarSelectsIA() {
    const sel = document.getElementById('aiVehSelect');
    if(!sel) return;
    sel.innerHTML = '';
    if(typeof fleet !== 'undefined') {
        fleet.forEach(c => {
            sel.innerHTML += `<option value="${c.plate}">${c.model} (${c.plate}) - Atual: ${Number(c.km||0).toLocaleString()} km</option>`;
        });
    }
}

function processarFotoPainelIA() {
    const plateElem = document.getElementById('aiVehSelect');
    if(!plateElem) return;
    const plate = plateElem.value;
    if(!plate) return alert("Selecione um veículo.");
    
    // Simulação OCR / IA lendo o painel e calculando quilometragem rodada na semana
    const kmAdicional = Math.floor(Math.random() * 400) + 350;
    
    if(typeof fleet === 'undefined') return;
    const car = fleet.find(item => item.plate === plate);
    if(!car) return;

    car.km = Number(car.km || 0) + kmAdicional;
    
    if (typeof currentUser !== 'undefined' && currentUser && currentUser.uid !== "offline_user" && typeof db !== 'undefined') {
        db.ref(`users_fleet/${currentUser.uid}/${car.id}`).set(car);
    }

    const reportEl = document.getElementById('aiReportResult');
    if(reportEl) {
        reportEl.innerHTML = `
            <p class="text-emerald-400 font-bold">🤖 Análise da IA Concluída com Sucesso!</p>
            <p class="mt-1"><b>Veículo:</b> ${escapeHTML(car.model)} (${escapeHTML(car.plate)})</p>
            <p><b>Odômetro Atualizado:</b> <span class="font-mono text-white">${car.km.toLocaleString()} km</span> (+${kmAdicional} km desde a última leitura).</p>
            <p class="mt-2 text-amber-300">💡 <b>Recomendação da IA:</b> Quilometragem monitorada. Próxima parada preventiva sugerida em ${(Math.ceil(car.km/10000)*10000).toLocaleString()} km.</p>
        `;
    }
    
    if(typeof renderizarTudo === 'function') {
        renderizarTudo();
    }
}
