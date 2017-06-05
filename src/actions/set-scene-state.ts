import { ITargetOptions, ISteelState, IStoreNotifier } from '../types'
import { _, assign } from '../utils'
import { transitionTargetState } from '.'

export const transitionSceneState = (id: string, stateNames: string[]) => {
  return (store: ISteelState, notifier: IStoreNotifier) => {
    const scene = store.scenes[id]
    if (!scene) {
      return store
    }

    const targetOptions: ITargetOptions = assign({ inherited: true }, _, scene.props)
    for (let i = 0, ilen = scene.targets.length; i < ilen; i++) {
      store = transitionTargetState(scene.targets[i], stateNames, targetOptions)(store, notifier)
    }

    return store
  }
}
