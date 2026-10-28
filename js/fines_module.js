// --- MÓDULO DE GESTÃO DE MULTAS (fines_module.js) ---

function renderFinesTable() {
    const tbody = document.getElementById('finesTableBody');
    if(!tbody) return;
    tbody.innerHTML = '';
    if(typeof fines === 'undefined' || fines.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-slate-500">Nenhuma multa registrada.</td></tr>`;
        return;
    }
    fines.forEach(f => {
        let badge = 'bg-amber-500/20 text-amber-400';
        if(f.status === 'Pago pelo Motorista' || f.status === 'Descontado em Repasse') badge = 'bg-emerald-500/20 text-emerald-400';
        tbody.innerHTML += `
            <tr class="hover:bg-slate-800/50">
                <td class="p-3 text-slate-300">${escapeHTML(f.date)}</td>
                <td class="p-3 font-semibold text-white">${escapeHTML(f.driverName)}</td>
                <td class="p-3"><span class="plate-tag text-xs">${escapeHTML(f.plate)}</span></td>
                <td class="p-3 text-slate-300">${escapeHTML(f.desc)}</td>
                <td class="p-3 text-rose-400 font-bold">${formatCurr(f.value)}</td>
                <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${badge}">${escapeHTML(f.status)}</span></td>
                <td class="p-3 text-center">
                    <button onclick="deleteFine('${f.id}')" class="text-rose-400 hover:underline text-xs font-bold">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function openFineModal() { 
    const modal = document.getElementById('fineModal');
    if(modal) modal.classList.remove('hidden'); 
}

function closeFineModal() { 
    const modal = document.getElementById('fineModal');
    if(modal) modal.classList.add('hidden'); 
}

function saveFine(e) {
    e.preventDefault();
    const id = 'fine_' + Date.now();
    const drvId = document.getElementById('fineDriver').value;
    const drvObj = typeof drivers !== 'undefined' ? drivers.find(d => d.id === drvId) : null;
    
    const fine = {
        id,
        driverId: drvId,
        driverName: drvObj ? drvObj.name : 'Motorista',
        plate: document.getElementById('fineVehicle').value,
        date: document.getElementById('fineDate').value,
        desc: document.getElementById('fineDesc').value.trim(),
        value: parseFloat(document.getElementById('fineValue').value) || 0,
        status: document.getElementById('fineStatus').value
    };
    
    if(typeof fines !== 'undefined') fines.push(fine);
    
    if (typeof currentUser !== 'undefined' && currentUser && currentUser.uid !== "offline_user" && typeof db !== 'undefined') {
        db.ref(`users_fines/${currentUser.uid}/${id}`).set(fine);
    }
    
    closeFineModal();
    renderFinesTable();
}

function deleteFine(id) {
    if(typeof fines !== 'undefined') {
        fines = fines.filter(f => f.id !== id);
    }
    if (typeof currentUser !== 'undefined' && currentUser && currentUser.uid !== "offline_user" && typeof db !== 'undefined') {
        db.ref(`users_fines/${currentUser.uid}/${id}`).remove();
    }
    renderFinesTable();
}

function atualizarSelectsMultas() {
    const drvSel = document.getElementById('fineDriver');
    const vehSel = document.getElementById('fineVehicle');
    if(!drvSel || !vehSel) return;
    
    drvSel.innerHTML = '';
    if(typeof drivers !== 'undefined') {
        drivers.forEach(d => { drvSel.innerHTML += `<option value="${d.id}">${d.name}</option>`; });
    }
    
    vehSel.innerHTML = '';
    if(typeof fleet !== 'undefined') {
        fleet.forEach(c => { vehSel.innerHTML += `<option value="${c.plate}">${c.model} (${c.plate})</option>`; });
    }
}
