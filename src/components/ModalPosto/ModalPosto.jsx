import React from 'react';
import './ModalPosto.css';

export default function ModalPosto({ posto, onClose }) {
    // Defesa: se não houver posto selecionado, não renderiza nada
    if (!posto) return null;

    // Pega as vacinas reais vindas do banco de dados (se não existirem, deixa um array vazio)
    const vacinasReais = posto.vacinas || [];

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
                    {vacinasReais.length > 0 ? (
                        vacinasReais.map((vacina, index) => {
                            const temEstoque = vacina.quantidade > 0;
                            
                            return (
                                <div 
                                    key={index} 
                                    className={`modal-posto-tag ${!temEstoque ? 'esgotada' : ''}`}
                                    title={temEstoque ? `${vacina.quantidade} doses disponíveis` : 'Estoque zerado'}
                                >
                                    {temEstoque ? (
                                        <>
                                            <span className="modal-posto-check">✓</span> 
                                            {vacina.nome} <small>({vacina.quantidade} un)</small>
                                        </>
                                    ) : (
                                        <>
                                            <span className="modal-posto-x">✕</span> 
                                            <span className="riscado">{vacina.nome}</span> <small>(Esgotada)</small>
                                        </>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className="modal-posto-no-data">Nenhuma vacina cadastrada para este posto.</p>
                    )}
                </div>

                <button className="modal-posto-btn-close" onClick={onClose}>
                    Fechar
                </button>
            </div>
        </div>
    );
}