import React, { useState } from 'react';

/** -------------------------------------------------------------
 *  COZY STORYBOOK VILLAGER DIALOGUE MODAL
 * ------------------------------------------------------------- */
const VILLAGER_DIALOGUES = {
  Mia: {
    dialogue: "Hello! It's a beautiful day, isn't it? 🌸 The blossoms are extra fragrant this morning!",
    portraitColor: '#ffb5a7',
    hairColor: '#e6c594',
    quests: ["Gather 3 Wild Roses for the flower shop", "Deliver a lily bouquet to Nora at the Café"],
  },
  Theo: {
    dialogue: "Fresh cinnamon rolls and sourdough bread just came out of the oven! 🥐 Would you like a warm slice?",
    portraitColor: '#f4a261',
    hairColor: '#7a4a2b',
    quests: ["Fetch a sack of golden wheat from the mill", "Deliver a warm loaf to Postman Leo"],
  },
  Nora: {
    dialogue: "Welcome to the Cozy Café! ☕ A fresh batch of honey chamomile tea is brewing.",
    portraitColor: '#fae1c5',
    hairColor: '#3d2616',
    quests: ["Collect 2 jars of fresh honey from Daisy", "Clean off the outdoor café benches"],
  },
  Luna: {
    dialogue: "Welcome to the Storybook Library! 📚 I just finished organizing the fairytale folklore section.",
    portraitColor: '#a8dadc',
    hairColor: '#b55239',
    quests: ["Return the borrowed stargazing book to Felix", "Find a missing bookmark in the meadow"],
  },
  Leo: {
    dialogue: "Good day, traveler! 📮 I have a stack of digital letters traveling via snail mail today!",
    portraitColor: '#e63946',
    hairColor: '#7a4a2b',
    quests: ["Deliver a letter to Oliver at the Gardener Cottage", "Check the village square mailbox"],
  },
  Emma: {
    dialogue: "Hello there! 🛍️ The General Store has fresh seeds, lanterns, and gardening tools in stock!",
    portraitColor: '#e07a5f',
    hairColor: '#e6c594',
    quests: ["Restock the vegetable seed display", "Bring 4 polished stones for crafting"],
  },
  Oliver: {
    dialogue: "Ah, welcome to my garden! 🥕 The pumpkins and carrots are growing exceptionally well this season.",
    portraitColor: '#84b574',
    hairColor: '#3d2616',
    quests: ["Water the seedling patch in the orchard", "Pick 3 ripe tomatoes"],
  },
  Sophie: {
    dialogue: "The morning light over the stone bridge is so inspiring! 🎨 I'm painting a landscape of the village.",
    portraitColor: '#c9a7e0',
    hairColor: '#b55239',
    quests: ["Gather berry pigments for paint", "Bring a wooden easel to the meadow"],
  },
  Milo: {
    dialogue: "Clack clack! 🪵 The timber workshop is crafting sturdy fences and wooden benches today.",
    portraitColor: '#d4a373',
    hairColor: '#7a4a2b',
    quests: ["Collect 5 oak logs from the forest edge", "Repair the garden fence post"],
  },
  Noah: {
    dialogue: "Greeting, nature lover! 🌿 I'm preparing herbal salves from lavender and mint.",
    portraitColor: '#2a9d8f',
    hairColor: '#e6c594',
    quests: ["Gather 4 sprigs of wild lavender", "Fetch clean spring water from the stream"],
  },
  Clara: {
    dialogue: "Click-clack! 🧶 My loom is weaving cozy wool blankets and pastel tapestries.",
    portraitColor: '#e9c46a',
    hairColor: '#3d2616',
    quests: ["Bring soft white wool from the meadow", "Deliver a handwoven scarf to Mia"],
  },
  Felix: {
    dialogue: "Greetings, stargazer! 🔭 Clear skies tonight — the constellations over our valley will be spectacular!",
    portraitColor: '#1d3557',
    hairColor: '#7a4a2b',
    quests: ["Clean the observatory lens glass", "Chart the moon alignment"],
  },
};

export default function VillagerDialogueModal({ villager, onClose }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [giftGiven, setGiftGiven] = useState(false);

  if (!villager) return null;

  const data = VILLAGER_DIALOGUES[villager.name] || {
    dialogue: `Hello there! I'm ${villager.name} the ${villager.job || 'villager'}. Have a wonderful day in our village! 🌸`,
    portraitColor: '#f2c9a0',
    hairColor: '#7a4a2b',
    quests: ['Help around the village garden'],
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '620px',
      backgroundColor: 'rgba(255, 250, 240, 0.96)',
      backdropFilter: 'blur(12px)',
      borderRadius: '24px',
      border: '3px solid #e9c46a',
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
      padding: '24px',
      zIndex: 1000,
      fontFamily: "'Outfit', 'Inter', sans-serif",
      color: '#3d2616',
      animation: 'fadeInUp 0.3s ease-out',
    }}>
      {/* Header with Avatar Portrait */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '16px' }}>
        {/* Avatar Circle */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: data.portraitColor,
          border: '3px solid #ffffff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          position: 'relative',
        }}>
          👤
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            padding: '2px',
            fontSize: '14px',
          }}>
            {villager.pet === 'cat' ? '🐱' : villager.pet === 'dog' ? '🐶' : '🐰'}
          </div>
        </div>

        {/* Villager Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#4a2c11' }}>
              {villager.name}
            </h2>
            <span style={{
              backgroundColor: '#e9c46a',
              color: '#4a2c11',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600,
            }}>
              {villager.job || 'Villager'}
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#8c5a3c' }}>
            ❤️ Friendship Level: 🌟🌟🌟 (Best Friends)
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#7a4a2b',
            padding: '4px 8px',
          }}
        >
          ✖
        </button>
      </div>

      {/* Speech Dialogue Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1.5px solid #e0c987',
        padding: '16px 20px',
        fontSize: '16px',
        lineHeight: 1.5,
        color: '#4a2c11',
        marginBottom: '20px',
        position: 'relative',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.03)',
      }}>
        {activeTab === 'chat' && data.dialogue}
        {activeTab === 'quest' && (
          <div>
            <strong style={{ color: '#e76f51' }}>📜 Daily Villager Quest:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              {data.quests.map((q, idx) => (
                <li key={idx} style={{ margin: '4px 0' }}>{q}</li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'gift' && (
          <div>
            {giftGiven ? (
              <span style={{ color: '#2a9d8f', fontWeight: 600 }}>
                🎁 Thank you so much! {villager.name} loved your gift of fresh flowers! (+50 Friendship)
              </span>
            ) : (
              <span>Give a fresh blossom bouquet or pastry to {villager.name}?</span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons Bar */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('chat')}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '14px',
            border: 'none',
            backgroundColor: activeTab === 'chat' ? '#e76f51' : '#f8edeb',
            color: activeTab === 'chat' ? '#ffffff' : '#7a4a2b',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          💬 Chat
        </button>
        <button
          onClick={() => {
            setActiveTab('gift');
            setGiftGiven(true);
          }}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '14px',
            border: 'none',
            backgroundColor: activeTab === 'gift' ? '#e76f51' : '#f8edeb',
            color: activeTab === 'gift' ? '#ffffff' : '#7a4a2b',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          🎁 Give Gift
        </button>
        <button
          onClick={() => setActiveTab('quest')}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '14px',
            border: 'none',
            backgroundColor: activeTab === 'quest' ? '#e76f51' : '#f8edeb',
            color: activeTab === 'quest' ? '#ffffff' : '#7a4a2b',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          📜 Quest
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '10px 20px',
            borderRadius: '14px',
            border: '1.5px solid #d4a373',
            backgroundColor: '#ffffff',
            color: '#7a4a2b',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          👋 Goodbye
        </button>
      </div>
    </div>
  );
}
