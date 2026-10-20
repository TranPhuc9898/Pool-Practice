import ExpoModulesCore

public final class PoolTableModule: Module {
  public func definition() -> ModuleDefinition {
    Name("PoolTable")
    View(PoolTableView.self)
    View(PoolBallRackView.self)
    View(PoolAimView.self)
    View(PoolEditorView.self)
    View(PoseCoachView.self)
  }
}
