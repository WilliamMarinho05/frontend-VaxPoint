import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import './PetFormModal.css';

function PetFormModal({ isOpen, onClose, onSalvar, editandoPetId, racasDisponiveis, dadosIniciais }) {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('Cachorro');
  const [idRaca, setIdRaca] = useState('1');
  const [porte, setPorte] = useState('Médio');
  const [peso, setPeso] = useState('');
  const [sexo, setSexo] = useState('Macho');
  const [dataNasc, setDataNasc] = useState('');
  const [microchip, setMicrochip] = useState('');
  const [foto, setFoto] = useState('');

  // Carrega dados se for edição OU limpa o formulário se for um novo Pet
  useEffect(() => {
    if (isOpen) {
      if (dadosIniciais) {
        // Se houver dados iniciais, preenche para EDICAO
        setNome(dadosIniciais.nome || '');
        setEspecie(dadosIniciais.especie || 'Cachorro');
        setIdRaca(dadosIniciais.id_raca?.toString() || '1');
        setPorte(dadosIniciais.porte || 'Médio');
        setPeso(dadosIniciais.peso || '');
        setSexo(dadosIniciais.sexo || 'Macho');
        setDataNasc(dadosIniciais.data_nascimento || '');
        setMicrochip(dadosIniciais.numero_microchip || '');
        setFoto(dadosIniciais.foto_url || '');
      } else {
        // Se NÃO houver dados iniciais, RESETA tudo para os padrões de NOVO PET
        setNome('');
        setEspecie('Cachorro');
        setIdRaca('1');
        setPorte('Médio');
        setPeso('');
        setSexo('Macho');
        setDataNasc('');
        setMicrochip('');
        setFoto('');
      }
    }
  }, [dadosIniciais, isOpen]);

  // Altera a raça automaticamente APENAS quando o usuário muda a espécie manualmente
  // Evita sobrescrever a raça correta durante a abertura da edição
  useEffect(() => {
    if (isOpen && !dadosIniciais) { 
      const primeiraRaca = racasDisponiveis.find(r => r.especie === especie);
      if (primeiraRaca) setIdRaca(primeiraRaca.id_raca.toString());
    }
  }, [especie, racasDisponiveis, isOpen]);

  // Handler separado para quando o usuário trocar a espécie manualmente no <select>
  const handleEspecieChange = (novaEspecie) => {
    setEspecie(novaEspecie);
    // Ao mudar manualmente a espécie, busca a primeira raça correspondente
    const primeiraRaca = racasDisponiveis.find(r => r.especie === novaEspecie);
    if (primeiraRaca) setIdRaca(primeiraRaca.id_raca.toString());
  };

  const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Se por qualquer oscilação de estado o "sexo" estiver vazio, 
    // nós garantimos o valor que está selecionado visualmente ('Macho')
    const sexoGarantido = sexo || 'Macho'; 
    const idRacaGarantido = idRaca || '1';

    onSalvar({ 
        nome, 
        especie, 
        idRaca: idRacaGarantido, 
        porte, 
        peso, 
        sexo: sexoGarantido, 
        dataNasc, 
        microchip, 
        foto 
    });
    };

  if (!isOpen) return null;

  return (
    <div className="pets-modal-overlay" onClick={onClose}>
      <div className="pets-modal-card wide" onClick={(e) => e.stopPropagation()}>
        <header className="pets-modal-header">
          <h3>{editandoPetId ? '✏️ Editar Pet' : '➕ Novo Pet'}</h3>
          <button className="pets-modal-close-icon" onClick={onClose}><X size={20} /></button>
        </header>
        
        <form onSubmit={handleSubmit} className="pets-modal-form">
          <div className="pets-upload-section">
            <label className="pets-upload-dropzone">
              {foto ? <img src={foto} alt="Preview" className="pets-upload-preview" /> : <Upload size={24} />}
              <span>Carregar Foto</span>
              <input type="file" accept="image/*" onChange={handleFotoUpload} hidden />
            </label>
          </div>

          <div className="pets-form-grid">
            <div className="pets-input-group">
              <label className="pets-label">Nome</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="pets-input" required />
            </div>

            <div className="pets-input-group">
              <label className="pets-label">Espécie</label>
              <select value={especie} onChange={(e) => handleEspecieChange(e.target.value)} className="pets-input">
                <option value="Cachorro">🐶 Cachorro</option>
                <option value="Gato">🐱 Gato</option>
              </select>
            </div>

            <div className="pets-input-group">
              <label className="pets-label">Raça</label>
              <select value={idRaca} onChange={(e) => setIdRaca(e.target.value)} className="pets-input">
                {racasDisponiveis.filter(r => r.especie === especie).map(r => (
                  <option key={r.id_raca} value={r.id_raca}>{r.nome_raca}</option>
                ))}
              </select>
            </div>

            <div className="pets-input-group">
              <label className="pets-label">Mês/Ano Nascimento</label>
              <input type="month" value={dataNasc} onChange={(e) => setDataNasc(e.target.value)} className="pets-input" required />
            </div>

            <div className="pets-input-group">
              <label className="pets-label">Peso (kg)</label>
              <input type="number" step="0.1" value={peso} onChange={(e) => setPeso(e.target.value)} className="pets-input" required />
            </div>

            <div className="pets-input-group">
              <label className="pets-label">Porte</label>
              <select value={porte} onChange={(e) => setPorte(e.target.value)} className="pets-input">
                <option value="Pequeno">Pequeno</option>
                <option value="Médio">Médio</option>
                <option value="Grande">Grande</option>
              </select>
            </div>

            <div className="pets-input-group">
              <label className="pets-label">Sexo</label>
              <select value={sexo} onChange={(e) => setSexo(e.target.value)} className="pets-input">
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>

            <div className="pets-input-group">
              <label className="pets-label">Nº Microchip / RGA (Opcional)</label>
              <input type="text" value={microchip} onChange={(e) => setMicrochip(e.target.value)} className="pets-input" />
            </div>
          </div>

          <button type="submit" className="pets-btn-submit-modal">
            {editandoPetId ? 'Salvar Alterações' : 'Cadastrar Pet'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PetFormModal;