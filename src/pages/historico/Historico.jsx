import React, { useEffect, useState } from "react";
import {
  Clock,
  Filter,
  Plus,
  CheckCircle,
  CalendarDays,
} from "lucide-react";

import "./Historico.css";

import api from "../../services/api";
import { buscarPetsAPI } from "../../services/petService";

function Historico() {
  const [usuario, setUsuario] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("TODOS");
  const [showModal, setShowModal] = useState(false);

  // Campos do Modal
  const [perfil, setPerfil] = useState("HUMANO");
  const [petSelecionado, setPetSelecionado] = useState("");
  const [vacina, setVacina] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState("CONCLUIDA");

  // Carrega usuário logado
  useEffect(() => {
    const dados = localStorage.getItem("vaxpoint_user");
    if (!dados) return;
    const usuarioLogado = JSON.parse(dados);
    setUsuario(usuarioLogado);
  }, []);

  // Carrega Histórico
  useEffect(() => {
    if (!usuario) return;
    carregarHistorico();
    carregarPets();
  }, [usuario]);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const idUsuario =
        usuario.id_usuario || usuario.id;
      const response = await api.get(
        `/historico/${idUsuario}`
      );
      const lista = response.data.map(item => ({
        id: item.id_historico,
        tipo:
          item.tipo === "Humano"
            ? "HUMANO"
            : "PET",

        beneficiario:
          item.nome_pet
            ? item.nome_pet
            : usuario.nome,
        vacina: item.nome_vacina,
        data: item.data_prevista,
        status: item.status
      }));
      setEventos(lista);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar histórico.");
    } finally {
      setLoading(false);
    }
  };

  // Pets do usuário 
  const carregarPets = async () => {
    try {
      const idUsuario =
        usuario.id_usuario || usuario.id;
      const dados = await buscarPetsAPI(idUsuario);
      setPets(dados);
    } catch (error) {
      console.error(error);
    }
  };

  // Registro de Vacina com Preparação para o backend(William verifique)
  const handleSalvarVacina = async (e) => {
    e.preventDefault();
    if (!vacina || !data) {
      alert("Preencha todos os campos.");
      return;
    }
    try {
      const payload = {
        id_usuario:
          usuario.id_usuario || usuario.id,
        id_pet:
          perfil === "PET"
            ? parseInt(petSelecionado)
            : null,
        id_vacina: vacina,
        data_prevista: data,
        status
      };
      await api.post("/historico", payload);
      setShowModal(false);
      setVacina("");
      setData("");
      setPetSelecionado("");
      carregarHistorico();
    }
    catch (error) {
      console.error(error);
      alert("Erro ao registrar vacina.");
    }
  };

  // Filtros
  const eventosFiltrados = eventos.filter((evento) => {
    if (filtro === "TODOS")
      return true;
    return evento.tipo === filtro;
  });
  if (loading) {
    return (
      <div className="historico-container">
        <h2>Carregando histórico...</h2>

      </div>
    );

  }

  <div className="historico-container">

  <header className="historico-header">
    <div>
      <h2 className="historico-title">
        <Clock size={26} color="#007BFF" />
        {" "}Linha do Tempo de Vacinação
      </h2>

      <p className="historico-subtitle">
        Histórico integrado e cronológico das vacinas registradas.
      </p>
    </div>

    <button
      className="historico-btn-launch"
      onClick={() => setShowModal(true)}
    >
      <Plus size={16} />
      Registrar Vacina
    </button>
  </header>

  {/* WILLIAM VERIFIQUE ESSES FILTROS */}
  <div className="historico-filter-bar">

    <span className="historico-filter-label">

      <Filter size={16} />
      Filtrar por:
    </span>

    <button
      onClick={() => setFiltro("TODOS")}
      className={
        filtro === "TODOS"
          ? "historico-btn-active"
          : "historico-btn-inactive"
      }
    >
      Ver Todas
    </button>
    <button
      onClick={() => setFiltro("HUMANO")}

      className={
        filtro === "HUMANO"
          ? "historico-btn-active"
          : "historico-btn-inactive"
      }

    >
      Só Minhas
    </button>
    <button

      onClick={() => setFiltro("PET")}
      className={
        filtro === "PET"
          ? "historico-btn-active"
          : "historico-btn-inactive"
      }
    >
      Só dos Pets
    </button>
  </div>
  <div className="historico-timeline">
    {eventosFiltrados.length === 0 && (
      <div className="historico-empty">
        <h3>Nenhum registro encontrado.</h3>
      </div>

    )}

    {eventosFiltrados.map((ev) => (
      <div
        key={ev.id}
        className="historico-timeline-item"
      >
        <div className="historico-timeline-dot">
          {ev.status === "CONCLUIDA"
            ? (
              <CheckCircle
                size={20}
                color="#10B981"
              />
            )
            : (
              <CalendarDays
                size={20}
                color="#007BFF"
              />
            )}

        </div>
        <div className="historico-timeline-content">
          <div className="historico-meta-row">
            <span

              className={
                ev.tipo === "HUMANO"
                  ? "historico-tag-humano"
                  : "historico-tag-pet"
              }
            >
              {ev.tipo}
            </span>
            <span className="historico-date-text">
              📅 {ev.data}
            </span>
          </div>
          <h4 className="historico-vacina-name">
            {ev.vacina}

          </h4>
          <p className="historico-benefi-text">
            Aplicada em:

            <strong>
              {" "}
              {ev.beneficiario}
            </strong>

          </p>

          <span
            className={
              ev.status === "CONCLUIDA"
                ? "historico-status-pronto"
                : "historico-status-agendado"
            }

          >
            {ev.status === "CONCLUIDA"
              ? "Dose Aplicada"
              : "Dose Planejada"}
          </span>
        </div>
      </div>

    ))}

  </div>


  {/* WILLIAM VERIFIQUE ESTE MODAL */}
  {showModal && (
    <div className="historico-modal-overlay">
      <div className="historico-modal-card">
        <h3 className="historico-modal-title">

          Registrar Vacina

        </h3>

        <form onSubmit={handleSalvarVacina}>
          <div className="historico-modal-group">
            <label className="historico-modal-label">

              Perfil

            </label>

            <select
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              className="historico-modal-input"

            >
              <option value="HUMANO">

                Humano

              </option>
              <option value="PET">

                Pet

              </option>
            </select>

          </div>


          {perfil === "PET" && (

            <div className="historico-modal-group">

              <label className="historico-modal-label">

                Pet

              </label>

              <select
                value={petSelecionado}
                onChange={(e) =>
                  setPetSelecionado(e.target.value)
                }
                className="historico-modal-input"

              >

                <option value="">

                  Selecione...

                </option>

                {pets.map((pet) => (
                  <option
                    key={pet.id_pet}
                    value={pet.id_pet}
                  >
                    {pet.nome}
                  </option>
                ))}
              </select>
            </div>

          )}


          <div className="historico-modal-group">
            <label className="historico-modal-label">

              ID da Vacina (temporário)

            </label>

            <input
              type="number"
              value={vacina}
              onChange={(e) => setVacina(e.target.value)}
              className="historico-modal-input"
              placeholder="Ex: 1"

            />

          </div>


          <div className="historico-modal-group">
            <label className="historico-modal-label">

              Data

            </label>

            <input

              type="date"

              value={data}

              onChange={(e) => setData(e.target.value)}

              className="historico-modal-input"

            />
          </div>

          <div className="historico-modal-group">
            <label className="historico-modal-label">

              Status

            </label>

            <select

              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="historico-modal-input"

            >
              <option value="CONCLUIDA">

                Concluída

              </option>

              <option value="PLANEJADA">

                Planejada
              </option>
            </select>
          </div>

          <div className="historico-modal-actions">

            <button
              type="button"
              className="historico-btn-cancel"
              onClick={() => setShowModal(false)}

            >
              Cancelar
            </button>

            <button
              type="submit"
              className="historico-btn-save"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>

  )}

</div>
}

export default Historico;