import { pendingChangesGuard, CanComponentDeactivate } from './pending-changes.guard';

describe('pendingChangesGuard (CanDeactivate - TP 05)', () => {
  it("devrait autoriser la sortie si le composant n'a pas de canDeactivate défini", () => {
    const component = {} as any;
    expect(pendingChangesGuard(component, {} as any, {} as any, {} as any)).toBe(true);
  });

  it('devrait appeler canDeactivate() du composant et retourner sa valeur', () => {
    const dirtyComponent: CanComponentDeactivate = {
      canDeactivate: () => false,
    };
    expect(pendingChangesGuard(dirtyComponent, {} as any, {} as any, {} as any)).toBe(false);

    const cleanComponent: CanComponentDeactivate = {
      canDeactivate: () => true,
    };
    expect(pendingChangesGuard(cleanComponent, {} as any, {} as any, {} as any)).toBe(true);
  });
});
