// Array para armazenar os agendamentos
let agendamentos = [];

// Função para verificar conflitos de agendamento
function verificarConflito(laboratorio, data, horario) {
  return agendamentos.some(agendamento => {
    return (
      agendamento.laboratorio === laboratorio &&
      agendamento.data === data &&
      agendamento.horario === horario
    );
  });
}

// Função para adicionar um agendamento
function adicionarAgendamento(event) {
  event.preventDefault();

  // Capturar os valores do formulário
  const nome = document.getElementById('nome').value;
  const disciplina = document.getElementById('disciplina').value;
  const laboratorio = document.getElementById('laboratorio').value;
  const data = document.getElementById('data').value;

  // Capturar os horários selecionados
  const horariosSelecionados = Array.from(document.querySelectorAll('.horario-btn.selecionado'))
    .map(btn => btn.getAttribute('data-horario'));

  // Verificar se pelo menos um horário foi selecionado
  if (horariosSelecionados.length === 0) {
    alert('Selecione pelo menos um horário.');
    return;
  }

  // Verificar conflitos para cada horário selecionado
  const conflitos = [];
  horariosSelecionados.forEach(horario => {
    if (verificarConflito(laboratorio, data, horario)) {
      conflitos.push(horario);
    }
  });

  // Se houver conflitos, exibir mensagem de erro
  if (conflitos.length > 0) {
    alert(`Conflito de horário! Os seguintes horários já estão agendados: ${conflitos.join(', ')}`);
    return;
  }

  // Criar um agendamento para cada horário selecionado
  horariosSelecionados.forEach(horario => {
    const agendamento = {
      id: Date.now() + Math.random(), // ID único
      nome,
      disciplina,
      laboratorio,
      data,
      horario
    };

    // Adicionar ao array de agendamentos
    agendamentos.push(agendamento);
  });

  // Limpar o formulário
  document.getElementById('agendamentoForm').reset();

  // Desmarcar todos os botões de horário
  document.querySelectorAll('.horario-btn').forEach(btn => btn.classList.remove('selecionado'));

  // Atualizar a tabela de agendamentos
  atualizarTabela();
}

// Função para editar um agendamento
function editarAgendamento(id) {
  // Encontrar o agendamento pelo ID
  const agendamento = agendamentos.find(a => a.id === id);
  if (agendamento) {
    // Preencher o formulário com os dados do agendamento
    document.getElementById('nome').value = agendamento.nome;
    document.getElementById('disciplina').value = agendamento.disciplina;
    document.getElementById('laboratorio').value = agendamento.laboratorio;
    document.getElementById('data').value = agendamento.data;

    // Marcar o horário selecionado
    document.querySelectorAll('.horario-btn').forEach(btn => {
      if (btn.getAttribute('data-horario') === agendamento.horario) {
        btn.classList.add('selecionado');
      } else {
        btn.classList.remove('selecionado');
      }
    });

    // Remover o agendamento da lista
    agendamentos = agendamentos.filter(a => a.id !== id);

    // Atualizar a tabela
    atualizarTabela();
  }
}

// Função para excluir um agendamento
function excluirAgendamento(id) {
  // Remover o agendamento da lista
  agendamentos = agendamentos.filter(a => a.id !== id);

  // Atualizar a tabela
  atualizarTabela();
}

// Função para atualizar a tabela de agendamentos
function atualizarTabela() {
  const tbody = document.querySelector('#agendamentosTable tbody');
  tbody.innerHTML = ''; // Limpar a tabela

  // Adicionar cada agendamento na tabela
  agendamentos.forEach(agendamento => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${agendamento.nome}</td>
      <td>${agendamento.disciplina}</td>
      <td>${agendamento.laboratorio}</td>
      <td>${agendamento.data}</td>
      <td>Horário ${agendamento.horario}</td>
      <td class="actions">
        <button class="btn btn-warning btn-sm editar" onclick="editarAgendamento(${agendamento.id})">Editar</button>
        <button class="btn btn-danger btn-sm excluir" onclick="excluirAgendamento(${agendamento.id})">Excluir</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// Função para marcar/desmarcar horários
document.querySelectorAll('.horario-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('selecionado');
  });
});

// Adicionar evento de submit ao formulário
document.getElementById('agendamentoForm').addEventListener('submit', adicionarAgendamento);

// Inicializar a tabela
atualizarTabela();