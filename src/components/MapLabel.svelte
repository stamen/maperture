<script>
  import { showDisplays as showDisplaysStore } from '../stores';

  let { index, name, onClose, disableClose, mapState, stylesheet, mapIdIndex } =
    $props();
</script>

{#if $showDisplaysStore}
  <div class="map-label">
    <button class="close-button" onclick={onClose} disabled={disableClose}>
      &times;
    </button>
    <div class="map-name">{name}</div>
    <!--
      TODO(svelte-5-port): MapStyleInputWrapper (style/renderer picker,
      branch patterns, custom JS injection) and MapLocationControl (manual
      coordinate entry) are deferred — see the framing-pass plan. This note
      stands in for both so the gap is visible rather than silent.
    -->
    <div class="options-container">
      <div class="deferred-note">style &amp; location controls: TODO</div>
    </div>
  </div>
{/if}

<style>
  .map-label {
    background: white;
    box-shadow: 0 0 10px 2px rgb(0 0 0 / 10%);
    padding: 1em;
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 300px;
  }

  .map-name {
    font-size: 1.25em;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .close-button {
    background-color: transparent;
    border: none;
    position: absolute;
    top: 0;
    right: 0;
    padding: 6px;
  }

  .close-button:hover {
    cursor: pointer;
    color: black;
  }

  .close-button:disabled {
    cursor: not-allowed;
    color: lightgray;
  }

  .options-container {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
  }

  .deferred-note {
    margin-top: 6px;
    font-size: 0.75em;
    font-style: italic;
    color: darkgray;
  }
</style>
