import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *authorityHide="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *authorityHide="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
@Directive({
  selector: '[authorityHide]',
})
export class AuthorityHideDirective {
  private authorities: string[];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private auth: AuthService
  ) {}

  @Input()
  set authorityHide(value: string | string[]) {
    this.authorities = typeof value === 'string' ? [value] : value;
    this.updateView();
  }

  private updateView(): void {
    if (this.auth.hasAnyAuthority(this.authorities)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
