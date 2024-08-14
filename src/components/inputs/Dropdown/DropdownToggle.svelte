<script>
  export let openTopLevel;
  export let topLevelOpen;
  export let activeLabel;
  export let placeholder;
  export let direction;

  const fakeFn = () => false;
</script>

<div
  class={`toggle ${
    topLevelOpen &&
    (direction === 'up' ? 'active-toggle-top' : 'active-toggle-bottom')
  }`}
  on:click={openTopLevel}
  on:keydown={fakeFn}
>
  <div class="caret-container">
    <div class={topLevelOpen ? `caret-${direction}` : 'caret-right'} />
  </div>
  <div class="label-container">
    <div class="label">
      {activeLabel ?? placeholder}
    </div>
  </div>
</div>

<style>
  .toggle {
    height: 32px;
    border: 1px solid lightgray;
    padding-left: 6px;
    padding-right: 6px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .toggle:hover {
    background-color: #f9f9f9;
  }

  .active-toggle-top {
    border-top-right-radius: unset;
    border-top-left-radius: unset;
  }

  .active-toggle-bottom {
    border-bottom-right-radius: unset;
    border-bottom-left-radius: unset;
  }

  .label-container {
    flex-grow: 1;
    width: 0;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .label {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .caret-container {
    height: 1rem;
    width: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .caret-right {
    border-left: solid 5px black;
    border-top: solid 5px transparent;
    border-bottom: solid 5px transparent;
    height: 0;
    width: 0;
  }

  .caret-down {
    border-left: solid 5px transparent;
    border-right: solid 5px transparent;
    border-top: solid 5px black;
    height: 0;
    width: 0;
  }

  .caret-up {
    border-left: solid 5px transparent;
    border-right: solid 5px transparent;
    border-bottom: solid 5px black;
    height: 0;
    width: 0;
  }
</style>
