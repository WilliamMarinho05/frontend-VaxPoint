import React from 'react';
import './ModalPosto.css';

export default function ModalPosto({ posto, onClose }) {
    // Defesa: se não houver posto selecionado, não renderiza nada
    if (!posto) return null;

    // Lista de vacinas padrão (plano de fuga se o banco não trouxer dados)
    const vacinasPadrao = ["Antirrábica", "Gripe (Influenza)", "Tríplice Viral", "Covid-19"];

    return (
        <div className="modal-posto-overlay" onClick={onClose}>
            <div className="modal-posto-card" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-posto-title">{posto.nome || "Posto de Saúde"}</h2>
                
                <p className="modal-posto-text">
                    <span className="modal-posto-icon-margin">📍</span> 
                    {posto.endereco || "Endereço não informado"}
                </p>
                
                <div className="modal-posto-badge">
                    <span>🕒</span> Horário: {posto.horario || "07:00 às 19:00"}
                </div>
                
                <hr className="modal-posto-divider" />
                
                <h4 className="modal-posto-subtitle">📋 Vacinas Disponíveis em Estoque:</h4>
                
                <div className="modal-posto-grid">
                    {vacinasPadrao.map((vacina, index) => (
                        <div key={index} className="modal-posto-tag">
                            <span className="modal-posto-check">✓</span> {vacina}
                        </div>
                    ))}
                </div>

                <button className="modal-posto-btn-close" onClick={onClose}>
                    Fechar
                </button>
            </div>
        </div>
    );
}