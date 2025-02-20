// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB20wgZpWIh56rsJUdOr8o86gdcQAOz1a0",
  authDomain: "horascomplementares-1c545.firebaseapp.com",
  projectId: "horascomplementares-1c545",
  storageBucket: "horascomplementares-1c545.appspot.com",
  messagingSenderId: "808847184102",
  appId: "1:808847184102:web:c248fa1a686a392324ab27"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Dados de ajuste das horas complementares
const adjustmentRules = {
    "Projeto de Extensão": { factor: 0.10, limit: 40, category: "Extensão" },
    "Atividades Culturais": { factor: 0.80, limit: 5, category: "Extensão" },
    "Visitas Técnicas": { factor: 1.00, limit: 40, category: "Extensão" },
    "Visitas a Feiras e Exposições": { factor: 0.60, limit: 5, category: "Extensão" },
    "Cursos de Idiomas": { factor: 0.60, limit: 20, category: "Extensão" },
    "Palestras, Seminários e Congressos de Pesquisa (ouvinte)": { factor: 0.80, limit: 10, category: "Extensão" },
    "Palestras, Seminários e Congressos de Pesquisa (apresentador)": { factor: 1.00, limit: 15, category: "Extensão" },
    "Projeto Empresa Júnior": { factor: 0.20, limit: 20, category: "Extensão" },
    "Estágio Extracurricular": { factor: 0.70, limit: 40, category: "Ensino" },
    "Monitoria": { factor: 0.70, limit: 40, category: "Ensino" },
    "Concursos e Campeonatos Acadêmicos": { factor: 0.70, limit: 50, category: "Ensino" },
    "Defesas de TCC": { factor: 0.50, limit: 3, category: "Ensino" },
    "Cursos Profissionalizantes Específicos": { factor: 0.80, limit: 40, category: "Ensino" },
    "Cursos Profissionalizantes Gerais": { factor: 0.20, limit: 10, category: "Ensino" },
    "Iniciação Científica": { factor: 0.80, limit: 40, category: "Pesquisa" },
    "Publicação de artigos em periódicos científicos": { factor: 1.00, limit: 10, category: "Pesquisa" },
    "Publicação de artigos completos em anais de congressos": { factor: 1.00, limit: 7, category: "Pesquisa" },
    "Publicação de capítulo de livro": { factor: 1.00, limit: 7, category: "Pesquisa" },
    "Publicação de resumos de artigos em anais": { factor: 1.00, limit: 5, category: "Pesquisa" },
    "Registro de patentes como autor/coautor": { factor: 1.00, limit: 40, category: "Pesquisa" },
    "Premiação resultante de pesquisa científica": { factor: 1.00, limit: 10, category: "Pesquisa" },
    "Colaborador em atividades como Seminários e Congressos": { factor: 1.00, limit: 10, category: "Pesquisa" },
    "Palestras, Seminários e Congressos de Pesquisa (ouvinte)": { factor: 0.80, limit: 10, category: "Pesquisa" },
    "Palestras, Seminários e Congressos de Pesquisa (apresentador)": { factor: 1.00, limit: 15, category: "Pesquisa" }
};

// Lista de atividades que permitem múltiplas inserções
const multiInsertActivities = [
    "Publicação de artigos em periódicos científicos",
    "Publicação de artigos completos em anais de congressos",
    "Publicação de capítulo de livro",
    "Publicação de resumos de artigos em anais",
    "Registro de patentes como autor/coautor",
    "Premiação resultante de pesquisa científica",
    "Colaborador em atividades como Seminários e Congressos"
];

// Referências aos elementos do DOM
const form = document.getElementById('hoursForm');
const extensaoBody = document.getElementById('extensaoBody');
const ensinoBody = document.getElementById('ensinoBody');
const pesquisaBody = document.getElementById('pesquisaBody');
const totalHoursExtensaoElement = document.getElementById('totalHoursExtensao');
const totalHoursEnsinoElement = document.getElementById('totalHoursEnsino');
const totalHoursPesquisaElement = document.getElementById('totalHoursPesquisa');
const categorySelect = document.getElementById('category');
const typeSelect = document.getElementById('type');

// Variáveis para armazenar totais
let totalHoursExtensao = 0;
let totalHoursEnsino = 0;
let totalHoursPesquisa = 0;
let totalGeral = 0;

const activityTotals = {};

// Função para carregar as opções de Tipo de Atividade com base na Categoria selecionada
function loadTypeOptions(selectedCategory) {
    typeSelect.innerHTML = '<option value="" disabled selected>Selecione</option>'; // Limpa as opções atuais

    Object.keys(adjustmentRules).forEach(type => {
        if (adjustmentRules[type].category === selectedCategory) {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeSelect.appendChild(option);
        }
    });
}

// Configura o evento de mudança para a Categoria de Atividade
categorySelect.addEventListener('change', () => {
    const selectedCategory = categorySelect.value;
    loadTypeOptions(selectedCategory); // Carrega as opções de Tipo de Atividade
});

// Garante que o código seja executado após o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
    // Carrega as opções de Tipo de Atividade com base na Categoria inicial (se houver)
    const initialCategory = categorySelect.value;
    if (initialCategory) {
        loadTypeOptions(initialCategory);
    }
});

// Função para salvar uma atividade no Firestore
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const type = document.getElementById('type').value;
    const hours = parseFloat(document.getElementById('hours').value);
    const rule = adjustmentRules[type];

    if (!rule) return;

    const aproveitamento = rule.factor;
    const typeLimit = rule.limit;

    const isMultiInsert = multiInsertActivities.includes(type);
    let horasAproveitadas;

    if (!isMultiInsert) {
        if (!activityTotals[type]) {
            activityTotals[type] = 0;
        }
        const availableTypeHours = Math.max(0, typeLimit - activityTotals[type]);
        horasAproveitadas = Math.min(hours * aproveitamento, availableTypeHours);
        activityTotals[type] += horasAproveitadas;
    } else {
        horasAproveitadas = Math.min(hours * aproveitamento, typeLimit);
    }

    // Salvar no Firestore
    try {
        const docRef = await addDoc(collection(db, "atividades"), {
            description: description,
            type: type,
            hours: hours,
            aproveitamento: horasAproveitadas,
            category: rule.category,
            timestamp: new Date()
        });
        console.log("Documento salvo com ID: ", docRef.id);
    } catch (error) {
        console.error("Erro ao salvar no Firestore: ", error);
    }

    // Atualizar a interface
    const row = document.createElement('tr');
    row.innerHTML = 
        `<td>${description}</td>
        <td>${type}</td>
        <td>${hours}</td>
        <td>${horasAproveitadas.toFixed(2)}</td>`;

    if (rule.category === "Extensão") {
        extensaoBody.appendChild(row);
        totalHoursExtensao += horasAproveitadas;
        totalHoursExtensaoElement.textContent = totalHoursExtensao.toFixed(2);
    } else if (rule.category === "Ensino") {
        ensinoBody.appendChild(row);
        totalHoursEnsino += horasAproveitadas;
        totalHoursEnsinoElement.textContent = totalHoursEnsino.toFixed(2);
    } else if (rule.category === "Pesquisa") {
        pesquisaBody.appendChild(row);
        totalHoursPesquisa += horasAproveitadas;
        totalHoursPesquisaElement.textContent = totalHoursPesquisa.toFixed(2);
    }

    totalGeral = totalHoursExtensao + totalHoursEnsino + totalHoursPesquisa;
    document.getElementById('totalGeral').textContent = totalGeral.toFixed(2);

    form.reset();
});

// Função para carregar atividades do Firestore
async function loadActivities() {
    try {
        const querySnapshot = await getDocs(collection(db, "atividades"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = 
                `<td>${data.description}</td>
                <td>${data.type}</td>
                <td>${data.hours}</td>
                <td>${data.aproveitamento.toFixed(2)}</td>`;

            if (data.category === "Extensão") {
                extensaoBody.appendChild(row);
                totalHoursExtensao += data.aproveitamento;
                totalHoursExtensaoElement.textContent = totalHoursExtensao.toFixed(2);
            } else if (data.category === "Ensino") {
                ensinoBody.appendChild(row);
                totalHoursEnsino += data.aproveitamento;
                totalHoursEnsinoElement.textContent = totalHoursEnsino.toFixed(2);
            } else if (data.category === "Pesquisa") {
                pesquisaBody.appendChild(row);
                totalHoursPesquisa += data.aproveitamento;
                totalHoursPesquisaElement.textContent = totalHoursPesquisa.toFixed(2);
            }

            totalGeral = totalHoursExtensao + totalHoursEnsino + totalHoursPesquisa;
            document.getElementById('totalGeral').textContent = totalGeral.toFixed(2);
        });
    } catch (error) {
        console.error("Erro ao carregar atividades do Firestore: ", error);
    }
}

// Carregar atividades ao iniciar a página
loadActivities();