"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PLAYERS } from "../data/players";
import { supabase } from "../lib/supabaseClient";


/* =========================================================
   ALBUM SHEET (vista normal)
========================================================= */
function AlbumSheet({
  title,
  subtitle,
  background,
  players,
  ownedIds,
  placedIds,
  leftNumber,
  rightNumber,
  onCardClick,
}: {
  title: string;
  subtitle: string;
  background: string;
  players: any[];
  ownedIds: number[];
  placedIds: number[];
  leftNumber: number;
  rightNumber: number;
  onCardClick: (player: any) => void;
}) {
  return (
     <div className="album-page relative mx-auto w-full max-w-[1200px] lg:max-w-[1600px] bg-white shadow-2xl overflow-hidden rounded-md border border-black/10">
      <img
        src={background}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-[#001421]/65" />

      {/* LIGHTS */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-cyan-400/20 blur-[120px] md:blur-[140px]" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-yellow-300/10 blur-[120px] md:blur-[140px]" />

      {/* DECORATIONS */}
      <div className="absolute top-0 left-0 w-[100px] h-[100px] md:w-[160px] md:h-[160px] border-l-[6px] md:border-l-[10px] border-t-[6px] md:border-t-[10px] border-yellow-300 rounded-tl-[24px] md:rounded-tl-[30px]" />
      <div className="absolute bottom-0 right-0 w-[100px] h-[100px] md:w-[160px] md:h-[160px] border-r-[6px] md:border-r-[10px] border-b-[6px] md:border-b-[10px] border-yellow-300 rounded-br-[24px] md:rounded-br-[30px]" />

      {/* TITLE */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-10 md:left-10 z-20">
        <h1 className="text-yellow-300 text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black italic leading-none drop-shadow-2xl">
          {title}
        </h1>
        <p className="text-white mt-1 sm:mt-2 md:mt-3 text-[10px] sm:text-xs md:text-sm lg:text-lg tracking-[0.15em] md:tracking-[0.3em]">
          {subtitle}
        </p>
      </div>

      {/* STICKERS GRID */}
      <div
        className="
          relative z-20
          grid
          grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
          gap-x-3 sm:gap-x-4 md:gap-x-8
          gap-y-8 sm:gap-y-10 md:gap-y-14
          px-3 sm:px-6 md:px-16 lg:px-24
          pt-16 sm:pt-20 md:pt-24
          pb-16 sm:pb-20 md:pb-24
        "
      >
        {players.map((player: any) => {
          const owned = ownedIds.includes(player.id);
          const placed = placedIds.includes(player.id);

          return (
            <div
              key={player.id}
              className="relative flex flex-col items-center justify-start"
            >
              {/* SLOT */}
              <div className="relative w-[110px] h-[160px] sm:w-[130px] sm:h-[190px] md:w-[160px] md:h-[220px] lg:w-[180px] lg:h-[250px] bg-white border-[3px] border-white shadow-2xl overflow-hidden">
                {!placed && (
                  <div className="absolute inset-0 bg-[#e7e7e7] flex flex-col items-center justify-center">
                    <div
                      className={`font-black text-4xl sm:text-5xl md:text-6xl ${
                        owned ? "text-black/20" : "text-black/10"
                      }`}
                    >
                      ?
                    </div>
                    <div className="text-black/30 tracking-[0.2em] text-[9px] sm:text-xs">
                      {owned ? "LISTO" : "LOCKED"}
                    </div>
                  </div>
                )}

                {placed && (
                  <button
                    type="button"
                    onClick={() => onCardClick(player)}
                    className="w-full h-full"
                  >
                    <motion.img
                      initial={{ scale: 0, rotate: -15, opacity: 0 }}
                      animate={{ scale: 1, rotate: -1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      whileHover={{ scale: 1.03, rotate: 0 }}
                      src={player.image}
                      className="w-full h-full object-cover rotate-[-1deg] shadow-2xl"
                    />
                  </button>
                )}

                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
              </div>

              {/* NAME */}
              <div className="mt-2 text-center px-1">
                <h3 className="text-white font-black text-[10px] sm:text-xs md:text-sm lg:text-base truncate max-w-[110px] sm:max-w-[130px] md:max-w-[160px] lg:max-w-[180px]">
                  {player.name}
                </h3>
                <p className="text-white/70 text-[9px] sm:text-[10px] md:text-xs lg:text-sm truncate">
                  {player.country}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGE NUMBERS */}
      <div className="absolute bottom-2 md:bottom-4 left-4 md:left-8 text-yellow-300 font-bold text-sm md:text-xl">
        {leftNumber}
      </div>
      <div className="absolute bottom-2 md:bottom-4 right-4 md:right-8 text-yellow-300 font-bold text-sm md:text-xl">
        {rightNumber}
      </div>
    </div>
  );
}

/* =========================================================
   ALBUM SHEET SIMPLE PARA PDF
========================================================= */
function SimpleAlbumSheetPDF({
  title,
  subtitle,
  background,
  players,
  ownedIds,
  placedIds,
  leftNumber,
  rightNumber,
}: {
  title: string;
  subtitle: string;
  background: string;
  players: any[];
  ownedIds: number[];
  placedIds: number[];
  leftNumber: number;
  rightNumber: number;
}) {

 const bgUrl =
    typeof window !== "undefined"
      ? window.location.origin + background
      : background;

  return (
    <div
      className="album-page"
      style={{
        width: 1123,
        height: 794,
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        border: "1px solid #cccccc",
        boxSizing: "border-box",
        fontFamily: "sans-serif",
      }}
    >
      {/* Capa oscura encima del fondo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 20, 33, 0.65)",
        }}
      />

      {/* CONTENIDO */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          padding: 40,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Título */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              margin: 0,
              color: "#FACC15", // amarillo
              fontStyle: "italic",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginTop: 4,
              color: "#ffffff",
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Grid simple 4x2 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridAutoRows: "1fr",
            gap: 24,
            flex: 1,
          }}
        >
          {players.map((player: any) => {
            const owned = ownedIds.includes(player.id);
            const placed = placedIds.includes(player.id);

            return (
              <div
                key={player.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 150,
                    height: 210,
                    border: "2px solid #ffffff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    backgroundColor: "#f5f5f5",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {!placed && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999999",
                        fontSize: 40,
                        fontWeight: 800,
                      }}
                    >
                      <div>?</div>
                      <div
                        style={{
                          fontSize: 10,
                          letterSpacing: 2,
                          marginTop: 4,
                        }}
                      >
                        {owned ? "LISTO" : "LOCKED"}
                      </div>
                    </div>
                  )}

                  {placed && (
                    <img
                      src={player.image}
                      alt={player.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>

                <div style={{ marginTop: 8, textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      maxWidth: 150,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "#ffffff",
                    }}
                  >
                    {player.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#e5e7eb",
                      maxWidth: 150,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {player.country}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Números de página */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 24,
            fontSize: 14,
            fontWeight: 700,
            color: "#FACC15",
          }}
        >
          {leftNumber}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 16,
            right: 24,
            fontSize: 14,
            fontWeight: 700,
            color: "#FACC15",
          }}
        >
          {rightNumber}
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   MAIN PAGE
========================================================= */

export default function AlbumPage() {
  const [collection, setCollection] = useState<any[]>([]);
  const [placedIds, setPlacedIds] = useState<number[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);

  const [players, setPlayers] = useState<any[]>(PLAYERS);


  // grupos
  const francia = players.filter((p) => p.country === "Francia");
  const alemania = players.filter((p) => p.country === "Alemania");
  const portugal = players.filter((p) => p.country === "Portugal");
  const colombia = players.filter((p) => p.country === "Colombia");
  const brasil = players.filter((p) => p.country === "Brasil");
  const extra = players.filter((p) => p.country === "Extra");

  const sections = [
    {
      key: "francia",
      title: "FRANCIA",
      subtitle: "GRUPO A",
      background: "/album/francia.jpg",
      players: francia,
    },
    {
      key: "alemania",
      title: "ALEMANIA",
      subtitle: "GRUPO B",
      background: "/album/alemania.jpg",
      players: alemania,
    },
    {
      key: "portugal",
      title: "PORTUGAL",
      subtitle: "GRUPO C",
      background: "/album/portugal.jpeg",
      players: portugal,
    },
    {
      key: "colombia",
      title: "COLOMBIA",
      subtitle: "GRUPO D",
      background: "/album/colombia.jpg",
      players: colombia,
    },
    {
      key: "brasil",
      title: "BRASIL",
      subtitle: "GRUPO E",
      background: "/album/brasil.jpg",
      players: brasil,
    },
    {
      key: "extra",
      title: "EXTRAS",
      subtitle: "CARTAS ESPECIALES",
      background: "/album/extras.jpg",
      players: extra,
    },
  ];
  
      useEffect(() => {
        async function loadPlayers() {
          console.log("LOAD PLAYERS useEffect DISPARADO");

          const { data, error } = await supabase
            .from("players")
            .select("*")
            .order("id", { ascending: true });

          console.log("SUPABASE RESPUESTA:", { data, error });

          if (error) {
            console.error("Error cargando players:", error);
            // dejamos players como PLAYERS locales
            return;
          }

          if (data && data.length > 0) {
            console.log("PLAYERS SUPABASE:", data);
            setPlayers(data);
          } else {
            console.log("No hay players en Supabase, usando PLAYERS locales");
            // NO hacemos setPlayers([]), se quedan los locales
          }
        }

        loadPlayers();
      }, []);


      useEffect(() => {
        async function loadUserProgress() {
          const currentUserId = localStorage.getItem("currentUserId");
          if (!currentUserId) return;

          // 1) colección desde user_cards
          const { data: userCards, error: userCardsError } = await supabase
            .from("user_cards")
            .select("player_id")
            .eq("user_id", currentUserId);

          if (userCardsError) {
            console.error("Error cargando user_cards:", userCardsError);
            return;
          }

          const collectionIds = userCards?.map((r) => r.player_id) || [];
          // guardamos solo { id } para que ownedIds funcione
          setCollection(collectionIds.map((id) => ({ id })));

          // 2) cartas ya pegadas
          const { data: placed, error: placedError } = await supabase
            .from("album_placed")
            .select("player_id")
            .eq("user_id", currentUserId);

          if (placedError) {
            console.error("Error cargando album_placed:", placedError);
            return;
          }

          setPlacedIds(placed?.map((r) => r.player_id) || []);
        }

        loadUserProgress();
      }, []);

      



  const ownedIds = useMemo(
    () => collection.map((p) => p.id),
    [collection]
  );

  const availableCards = useMemo(
    () =>
      players.filter(
        (p) => ownedIds.includes(p.id) && !placedIds.includes(p.id)
      ),
    [players, ownedIds, placedIds]
  );

// función que escribe en album_placed
const placeCard = async (userId: string, playerId: number) => {
  const { data, error } = await supabase
    .from("album_placed")
    .insert({
      user_id: userId,
      player_id: playerId,
    })
    .select();

  console.log("ALBUM INSERT", {
    userId,
    playerId,
    data,
    error,
  });

  if (error) {
    console.error("Error guardando en album_placed:", error);
    return false;
  }

  return true;
};

const placeSticker = async (playerId: number) => {
  if (placedIds.includes(playerId)) {
    return;
  }

  const currentUserId = localStorage.getItem("currentUserId");

  if (!currentUserId) return;

  const success = await placeCard(currentUserId, playerId);

  if (!success) return;

  setPlacedIds((prev) => [...prev, playerId]);
};


  const handlePlaceFromBar = (player: any) => {
    const currentSection = sections[currentSectionIndex];

    const isOnThisPage = currentSection.players.some(
      (p) => p.id === player.id
    );

    if (!isOnThisPage) {
      alert("Esta carta no pertenece a esta página del álbum.");
      return;
    }

    placeSticker(player.id);
  };

const exportPDF = async () => {
  console.log("Export PDF clicked");
  alert("PDF paso 1: clic detectado");

  try {
    const container = document.getElementById("album-export");
    console.log("container:", container);
    if (!container) {
      alert("PDF paso 2: #album-export no encontrado");
      return;
    }

    const pageElements = Array.from(
      container.getElementsByClassName("album-page")
    ) as HTMLElement[];

    console.log("pageElements length:", pageElements.length);
    if (!pageElements.length) {
      alert("PDF paso 3: no hay .album-page dentro de #album-export");
      return;
    }

    const html2canvasModule = await import("html2canvas");
    const jsPDFModule = await import("jspdf");
    const html2canvas = html2canvasModule.default;
    const { jsPDF } = jsPDFModule;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: "a4",
    });

    for (let i = 0; i < pageElements.length; i++) {
      const el = pageElements[i];

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = (canvas.height * pageWidth) / canvas.width;

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    }

    pdf.save("mundialito-album.pdf");
    alert("PDF paso 4: generado");
  } catch (err) {
    console.error("Error generando PDF:", err);
    alert("PDF error (mira la consola)");
  }
};


  const openCardModal = (player: any) => {
    setSelectedCard(player);
    setShowCardModal(true);
  };

  const closeCardModal = () => {
    setShowCardModal(false);
    setSelectedCard(null);
  };

  return (
    <main className="min-h-screen bg-[#d9d9d9] flex flex-col">
      {/* TOPBAR */}
      <div className="sticky top-0 z-50 h-[64px] md:h-[72px] bg-[#083847] border-b border-black/20 flex items-center justify-between px-4 md:px-6">
        <button
          onClick={() => {
            window.location.href = "/home";
          }}
          className="bg-black/20 hover:bg-black/40 transition text-white px-4 py-1.5 md:px-5 md:py-2 rounded-xl border border-white/20 text-xs md:text-sm"
        >
          ← Volver
        </button>

        <div className="flex items-center gap-2 md:gap-4">
          <img
            src="/album/logo.png"
            className="h-6 md:h-8 object-contain"
          />
          <h1 className="text-white text-sm md:text-2xl tracking-wide">
            ÁLBUM DIGITAL CC
          </h1>
        </div>

        <button
          onClick={exportPDF}
          className="bg-yellow-500/10 hover:bg-yellow-500/20 transition text-yellow-300 px-4 py-1.5 md:px-5 md:py-2 rounded-xl border border-yellow-400/20 text-xs md:text-sm"
        >
          PDF
        </button>
      </div>

      {/* CONTENIDO */}
     <div className="flex-1 flex flex-col items-center gap-4 md:gap-8 py-4 md:py-6 px-2 md:px-4 lg:px-0">
        {/* COVER + PÁGINAS */}
        <div className="w-full flex flex-col items-center gap-6 md:gap-10">
          {/* COVER */}
         <div className="relative mx-auto w-full max-w-[1200px] lg:max-w-[1600px] aspect-[9/16] sm:aspect-[16/9] overflow-hidden shadow-2xl rounded-md">

            <img
              src="/album/cover.jpg"
              className="absolute inset-0 w-full h-full object-cover"
            />
          
          
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
              <h1 className="text-[36px] sm:text-[60px] md:text-[100px] lg:text-[140px] font-black text-emerald-400 tracking-[0.1em] sm:tracking-[0.15em] text-center drop-shadow-2xl">
                MUNDIALITO
              </h1>
              <p className="text-white tracking-[0.3em] sm:tracking-[0.6em] text-xs sm:text-xl md:text-3xl mt-4 sm:mt-6 text-center">
                ALBUM OFICIAL
              </p>
              <div className="mt-4 sm:mt-8 text-white/80 text-xl sm:text-2xl md:text-3xl">
                CONTAC CENTER GTI 2026
              </div>
            </div>
          </div>
          </div>

          {/* CONTROLES DE PÁGINA + ALBUM */}
          <div className="w-full flex flex-col itemscenter gap-4">
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <button
                onClick={() =>
                  setCurrentSectionIndex((i) => Math.max(i - 1, 0))
                }
                className="px-3 py-1 rounded-full border border-black/30 bg-white/80 text-[11px] sm:text-xs md:text-sm"
              >
                ← Anterior
              </button>

              <span className="text-[11px] sm:text-xs md:text-sm text-black/70">
                Página {currentSectionIndex + 1} / {sections.length}
              </span>

              <button
                onClick={() =>
                  setCurrentSectionIndex((i) =>
                    Math.min(i + 1, sections.length - 1)
                  )
                }
                className="px-3 py-1 rounded-full border border-black/30 bg-white/80 text-[11px] sm:text-xs md:text-sm"
              >
                Siguiente →
              </button>
            </div>

           
          </div>
  
            <AlbumSheet
              title={sections[currentSectionIndex].title}
              subtitle={sections[currentSectionIndex].subtitle}
              background={sections[currentSectionIndex].background}
              players={sections[currentSectionIndex].players}
              ownedIds={ownedIds}
              placedIds={placedIds}
              leftNumber={currentSectionIndex * 2 + 1}
              rightNumber={currentSectionIndex * 2 + 2}
              onCardClick={openCardModal}
            />
          </div>

      {/* BARRA INFERIOR: CARTAS DISPONIBLES */}
      <div className="sticky bottom-0 z-40 w-full bg-[#001421]/95 border-t border-black/30 px-3 md:px-4 py-2 md:py-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] sm:text-xs text-white/70 tracking-[0.15em]">
            MIS CARTAS
          </span>
          <span className="text-[9px] sm:text-[10px] text-white/40">
            (haz click para pegarlas en esta página)
          </span>
        </div>

        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-1 md:pb-2">
          {availableCards.length === 0 ? (
            <span className="text-[10px] sm:text-xs text-white/50">
              No tienes cartas disponibles para pegar.
            </span>
          ) : (
            availableCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handlePlaceFromBar(card)}
                className="relative flex-shrink-0 w-[64px] h-[92px] sm:w-[80px] sm:h-[115px] md:w-[90px] md:h-[130px] rounded-lg overflow-hidden border border-white/20 bg-black/40 hover:scale-105 hover:border-yellow-300/60 transition"
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] sm:text-[9px] px-1 py-[2px] text-center truncate">
                  {card.name}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* MODAL CARTA GRANDE */}
      {showCardModal && selectedCard && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center">
          <button
            onClick={closeCardModal}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white text-2xl md:text-3xl hover:text-yellow-300 transition"
          >
            ✕
          </button>

          <div className="relative w-[90vw] max-w-[360px] h-[460px] md:h-[520px] rounded-[32px] overflow-hidden border border-white/20 bg-gradient-to-b from-white/10 to-black shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center justify-center">
            <img
              src={selectedCard.image}
              alt={selectedCard.name}
              className="max-h-[80%] max-w-[80%] object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]"
            />

            <div className="absolute bottom-4 left-0 right-0 text-center px-4">
              <h2 className="text-white font-black text-xl md:text-2xl truncate">
                {selectedCard.name}
              </h2>
              <p className="text-white/70 text-xs md:text-sm">
                {selectedCard.country} • OVR {selectedCard.overall}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONTENEDOR OCULTO PARA PDF */}
<div
  id="album-export"
  style={{
    position: "absolute",
    left: "-99999px",
    top: 0,
  }}
>
  {/* PORTADA COMO PRIMERA PÁGINA */}
  <div className="mb-4 flex justify-center">
    <div
      className="album-page"
      style={{
        width: 1123,
        height: 794,
        backgroundImage: `url(${typeof window !== "undefined"
          ? window.location.origin + "/album/cover.jpg"
          : "/album/cover.jpg"
        })`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        boxSizing: "border-box",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 80,
            fontWeight: 900,
            letterSpacing: 6,
            color: "#FACC15",
            textShadow: "0 0 25px rgba(0,0,0,0.8)",
          }}
        >
          MUNDIALITO
        </h1>
        <p
          style={{
            marginTop: 16,
            fontSize: 20,
            letterSpacing: 6,
            color: "#ffffff",
          }}
        >
          OFFICIAL STICKER ALBUM
        </p>
        <div
          style={{
            marginTop: 32,
            fontSize: 28,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          SAC 2026
        </div>
      </div>
    </div>
  </div>

  {/* PÁGINAS DEL ÁLBUM */}
  {sections.map((section, idx) => (
    <div key={section.key} className="mb-4 flex justify-center">
      <SimpleAlbumSheetPDF
        title={section.title}
        subtitle={section.subtitle}
        background={section.background}
        players={section.players}
        ownedIds={ownedIds}
        placedIds={placedIds}
        leftNumber={idx * 2 + 1}
        rightNumber={idx * 2 + 2}
      />
    </div>
  ))}
        </div>
    </main>
  );
 }

